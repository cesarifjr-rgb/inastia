"""Create a new Blender-authored Mediterranean coastal relief, without buildings.

Run: blender --background --python scripts/create-coast.py
The source and preview are saved outside the repository. No user scene is read.
"""
import bpy
import math
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT.parent / 'inastia-v3-evidence'
OUTPUT = ROOT / 'public/models/inastia-coast.glb'
EVIDENCE.mkdir(parents=True, exist_ok=True)
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
objects = []


def xyz(x, y, z):
    return (x, -z, y)


def linear(c):
    return c/12.92 if c <= .04045 else ((c+.055)/1.055)**2.4


def material(name, hex_color):
    mat = bpy.data.materials.new(name)
    rgb = tuple(linear(int(hex_color[i:i+2],16)/255) for i in (0,2,4))
    mat.diffuse_color = (*rgb,1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*rgb,1)
    bsdf.inputs['Roughness'].default_value = .78
    return mat


edge = material('Warm honed limestone', 'e7d5b5')
sky = material('Mediterranean sky', 'c2deeb')
sun = material('Soft ochre sun', 'e4bd73')
sea_far = material('Horizon blue', '9bc6d8')
sea_mid = material('Sea blue', '72abc6')
sea_near = material('Coastal azure', '4288aa')
foam = material('Sea foam mist', 'c8e3e7')
beach = material('Warm beach sand', 'e5cba0')
dune = material('Pale dune sand', 'f0dfbd')


def finish(obj, name, mat, bevel=.025):
    obj.name = name
    obj.data.materials.append(mat)
    if bevel:
        modifier = obj.modifiers.new('Hand polished soft edges', 'BEVEL')
        modifier.width = bevel
        modifier.segments = 2
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    obj['created_with'] = 'Blender 5.2 / Inastia coastal relief'
    objects.append(obj)
    return obj


def oval(name, x, y, z, rx, ry, depth, mat, bevel):
    bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=1, depth=depth, location=xyz(x,y,z), rotation=(math.pi/2,0,0))
    obj = bpy.context.object
    # Cylinder local XY circle becomes a vertical face after its rotation.
    obj.scale = (rx,ry,1)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj,name,mat,bevel)


oval('Oval limestone sculpture', 0,.8,0,4.5,3.4,.34,edge,.075)
oval('Inset powder blue sky', 0,.8,.19,4.33,3.23,.11,sky,.035)
oval('Sun disc', 1.25,2.29,.31,1.02,1.02,.17,sun,.045)


def layer(name, height, depth, mat):
    """A smooth coastal profile clipped to the oval, extruded into a physical layer."""
    rx, ry, cy = 4.29, 3.19, .8
    top, bottom = [], []
    for i in range(65):
        x = -rx + 2*rx*i/64
        extent = ry*math.sqrt(max(0,1-(x/rx)**2))
        lo, hi = cy-extent, cy+extent
        top.append((x,max(lo,min(hi,height(x)))))
        bottom.append((x,lo))
    # Explicit quad strips avoid unreliable tessellation of clipped concave n-gons.
    verts=[]
    for (x,up),(_,low) in zip(top,bottom):
        verts.extend([xyz(x,low,depth-.055),xyz(x,up,depth-.055),
                      xyz(x,low,depth+.055),xyz(x,up,depth+.055)])
    faces=[]
    for i in range(len(top)-1):
        a,b=4*i,4*(i+1)
        faces.extend([(a,a+1,b+1,b),(a+2,b+2,b+3,a+3),
                      (a+1,a+3,b+3,b+1),(a,b,b+2,a+2)])
    mesh=bpy.data.meshes.new(name)
    mesh.from_pydata(verts,[],faces)
    mesh.update()
    obj=bpy.data.objects.new(name,mesh)
    bpy.context.collection.objects.link(obj)
    finish(obj,name,mat,.025)


# Gentle asymmetry evokes a shoreline, not a diagram or mechanical stack.
layer('Distant horizon',lambda x:1.03+.055*math.sin(x*.8),.37,sea_far)
layer('Open water swell',lambda x:.43+.15*math.sin(x*.92+.5),.48,sea_mid)
layer('Near water swell',lambda x:-.08+.21*math.sin(x*.94+1.5),.59,sea_near)
layer('Fine foam coastline',lambda x:-.57+.47*math.sin(x*.65+.5),.70,foam)
layer('Warm beach',lambda x:-.66+.47*math.sin(x*.65+.5),.79,beach)
layer('Sculpted dune foreground',lambda x:-1.35+.30*math.cos(x*.82+1),.90,dune)

bpy.ops.object.select_all(action='DESELECT')
for obj in objects:
    obj.select_set(True)
triangles=sum(sum(len(p.vertices)-2 for p in obj.data.polygons) for obj in objects)
bpy.ops.export_scene.gltf(filepath=str(OUTPUT),export_format='GLB',use_selection=True,
    export_yup=True,export_cameras=False,export_lights=False,export_animations=False,export_extras=True)

scene=bpy.context.scene
world=bpy.data.worlds.new('Bright coastal studio')
world.use_nodes=True
world.node_tree.nodes['Background'].inputs[0].default_value=(.75,.84,.9,1)
world.node_tree.nodes['Background'].inputs[1].default_value=.45
scene.world=world


def light(name,loc,power,color,size):
    bpy.ops.object.light_add(type='AREA',location=xyz(*loc))
    obj=bpy.context.object
    obj.name=name
    obj.data.energy=power
    obj.data.color=color
    obj.data.shape='DISK'
    obj.data.size=size
    obj.rotation_euler=(Vector(xyz(0,.8,0))-obj.location).to_track_quat('-Z','Y').to_euler()


light('Broad warm daylight',(-5,7,9),1050,(1,.94,.82),7)
light('Sky bounce',(5,3,7),700,(.78,.9,1),6)
bpy.ops.object.camera_add(location=xyz(4,2.8,18))
camera=bpy.context.object
camera.rotation_euler=(Vector(xyz(0,.8,0))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type='ORTHO'
camera.data.ortho_scale=11.4
scene.camera=camera
scene.render.engine='CYCLES'
scene.cycles.samples=48
scene.cycles.use_denoising=True
scene.render.resolution_x=1100
scene.render.resolution_y=900
scene.render.resolution_percentage=100
scene.render.film_transparent=True
scene.render.image_settings.file_format='PNG'
scene.render.filepath=str(EVIDENCE/'inastia-coast-blender.png')
bpy.ops.wm.save_as_mainfile(filepath=str(EVIDENCE/'inastia-coast.blend'))
bpy.ops.render.render(write_still=True)
print(f'INASTIA_COAST Blender={bpy.app.version_string} meshes={len(objects)} triangles={triangles} bytes={OUTPUT.stat().st_size}')
(EVIDENCE/'coast-model-stats.txt').write_text(f'Blender {bpy.app.version_string}\nMeshes {len(objects)}\nTriangles {triangles}\nGLB bytes {OUTPUT.stat().st_size}\n',encoding='utf8')
