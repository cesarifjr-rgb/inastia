"""Author the Inastia villa in a NEW headless Blender scene and export a web GLB.

Run: blender --background --python scripts/create-villa.py
No existing .blend or user scene is read. Blender source/render stay outside git.
Coordinates below are expressed in Three.js metres (x, up-y, front-z).
"""
import bpy
import math
import random
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT.parent / "inastia-v2-evidence"
MODEL = ROOT / "public" / "models" / "inastia-villa.glb"
EVIDENCE.mkdir(parents=True, exist_ok=True)
MODEL.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.read_factory_settings(use_empty=True)
random.seed(17)


def xyz(x, y, z):
    return (x, -z, y)


def linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def material(name, color, roughness=.75, metal=0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    rgb = tuple(linear(int(color[i:i + 2], 16) / 255) for i in (0, 2, 4))
    m.diffuse_color = (*rgb, 1)
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*rgb, 1)
    bsdf.inputs['Roughness'].default_value = roughness
    bsdf.inputs['Metallic'].default_value = metal
    return m


ivory = material('Lime plaster | warm ivory', 'eee9d9')
limestone = material('Cut Corsican limestone', 'b4ac93')
travertine = material('Honed travertine', 'd4cbb5')
grout = material('Recessed stone joints', 'a7a38e')
rock = material('Island foundation', '626e67')
stone_variants = [material('Limestone course ' + str(i), c) for i, c in enumerate(['aba58c', 'c4bca4', 'b4af99'])]
wood = material('Oiled chestnut pergola', 'ac8757', .53)
trunk = material('Pine bark', '756346')
frame = material('Bronze dark window frames', '334647', .35, .55)
glass = material('Smoked blue architectural glazing', '17434c', .18, .5)
water = material('Mediterranean pool water', '439fa8', .21, .3)
foam = material('Water reflections', '93d7d9', .35)
linen = material('Natural linen cushions', 'ddd3bc', .95)
leaves = [material('Pine foliage ' + str(i), c) for i, c in enumerate(['436850', '56745c', '658066'])]
earth = material('Planter soil', '6e7360')
models = []


def finish(obj, name, mat, bevel=0, segments=1):
    obj.name = name
    obj.data.materials.append(mat)
    if bevel:
        modifier = obj.modifiers.new('Soft crafted edge', 'BEVEL')
        modifier.width = bevel
        modifier.segments = segments
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    models.append(obj)
    return obj


def box(name, dims, loc, mat, bevel=.012, segments=1):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz(*loc))
    obj = bpy.context.object
    obj.dimensions = (dims[0], dims[2], dims[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, bevel, segments)


def branch(name, a, b, radius, mat=trunk):
    a, b = Vector(xyz(*a)), Vector(xyz(*b))
    bpy.ops.mesh.primitive_cone_add(vertices=8, radius1=radius, radius2=radius*.68, depth=(b-a).length, location=(a+b)/2)
    obj = bpy.context.object
    obj.rotation_euler = (b-a).to_track_quat('Z', 'Y').to_euler()
    return finish(obj, name, mat)


# Chamfered suspended plot and individually laid terrace stones.
box('Floating island cut stone', (9.2, .60, 7), (0, -.40, 0), rock, .20, 3)
box('Travertine perimeter', (9.32, .18, 7.12), (0, -.025, 0), travertine, .085, 3)
box('Terrace joint bed', (8.94, .035, 6.75), (0, .08, 0), grout, .02)
for x in range(8):
    for z in range(6):
        box('Travertine paver', (1.095, .035, 1.095), (-3.86+x*1.106, .112, -2.77+z*1.11), travertine, .008)

# Two staggered volumes, deep eaves and a usable upper terrace.
box('Ground floor lime plaster', (5.10, 1.80, 2.45), (-.70, 1.05, -1.25), ivory, .035, 2)
box('Ground floor floating cornice', (5.42, .17, 2.76), (-.70, 2.02, -1.25), ivory, .024, 2)
box('Upper bedroom volume', (2.05, 1.03, 2.25), (-1.95, 2.61, -1.26), ivory, .022, 2)
box('Upper roof floating edge', (2.28, .15, 2.50), (-1.95, 3.20, -1.26), ivory, .02, 2)
box('Upper roof inset surface', (1.96, .055, 2.15), (-1.95, 3.30, -1.26), travertine, .015)
box('Upper terrace floor', (2.55, .045, 2.38), (.48, 2.13, -1.25), travertine)

# Individual limestone blocks wrap the western wing. Recessed joints are real geometry.
box('Masonry substrate', (.45, 1.80, 2.47), (-3.19, 1.05, -1.25), grout)
for row in range(7):
    for col in range(5):
        zz = -2.27 + col*.48
        box('Hand cut limestone facing', (.075, .238, .455), (-3.445, .31+row*.248, zz), stone_variants[(row+col)%3], .011)
    box('Masonry front return', (.46, .238, .065), (-3.19, .31+row*.248, .015), stone_variants[row%3], .012)

# Smoked glazing sits forward of a deep dark reveal; precise aluminium sections.
box('Front glass facade', (4.44, 1.44, .045), (-.60, 1.075, -.002), glass, .006)
for i in range(6):
    box('Front vertical mullion', (.036, 1.49, .074), (-2.82+i*.887, 1.075, .044), frame, .006)
for yy in [.335, 1.815]:
    box('Front frame rail', (4.50, .042, .078), (-.60, yy, .044), frame, .006)
box('East glass facade', (.045, 1.44, 1.84), (1.875, 1.075, -1.29), glass, .005)
for i in range(4):
    box('East mullion', (.075, 1.49, .032), (1.902, 1.075, -2.19+i*.60), frame, .006)
box('Upper bedroom glazing', (1.55, .73, .035), (-1.95, 2.61, -.118), glass)
box('Upper bedroom mullion', (.044, .76, .07), (-1.95, 2.61, -.092), frame, .006)
for i in range(8):
    box('Chestnut sun screen', (.055, 1.47, .12), (.53+i*.128, 1.08, .15), wood, .009)

# Pergola with mortise-like beams and narrow slats casting striped shade.
for x in [2.27, 3.91]:
    for z in [-1.77, .75]:
        box('Pergola post', (.087, 1.91, .087), (x, 1.10, z), wood, .01)
        box('Pergola post shoe', (.12, .1, .12), (x, .19, z), frame, .01)
    box('Pergola long beam', (.11, .15, 2.84), (x, 2.08, -.51), wood, .012)
for i in range(17):
    box('Pergola roof slat', (1.96, .085, .065), (3.09, 2.20, -1.89+i*.173), wood, .008)

# A small sculpted linen shade sail on the roof terrace.
sail_corners = [(-.65, 2.66, -2.23), (1.49, 2.77, -2.13), (1.43, 2.52, -.36)]
for corner in sail_corners:
    branch('Shade sail slender support', (corner[0], 2.12, corner[2]), corner, .018, frame)
verts, faces = [], []
resolution = 7
indices = {}
for i in range(resolution+1):
    for j in range(resolution+1-i):
        u, v = i/resolution, j/resolution
        w = 1-u-v
        point = [sail_corners[0][k]*u+sail_corners[1][k]*v+sail_corners[2][k]*w for k in range(3)]
        point[1] -= .30*27*u*v*w
        indices[i, j] = len(verts)
        verts.append(xyz(*point))
for i in range(resolution):
    for j in range(resolution-i):
        faces.append((indices[i,j],indices[i+1,j],indices[i,j+1]))
        if j < resolution-i-1:
            faces.append((indices[i+1,j],indices[i+1,j+1],indices[i,j+1]))
mesh = bpy.data.meshes.new('Sculpted shade sail mesh')
mesh.from_pydata(verts, [], faces)
sail = bpy.data.objects.new('Linen roof shade sail', mesh)
bpy.context.collection.objects.link(sail)
finish(sail, sail.name, linen)
for polygon in mesh.polygons:
    polygon.use_smooth = True

# Pool: stone coping, water surface and subtle broken caustic strands.
box('Pool shell', (4.87, .13, 1.85), (-.85, .17, 1.94), limestone, .028, 2)
box('Pool water surface', (4.57, .075, 1.53), (-.85, .238, 1.94), water, .018, 2)
for z in [1.045, 2.835]:
    box('Pool long coping', (4.87, .16, .115), (-.85, .20, z), ivory, .019, 2)
for x in [-3.23, 1.53]:
    box('Pool end coping', (.115, .16, 1.83), (x, .20, 1.94), ivory, .018, 2)
for row in range(5):
    points = []
    for i in range(21):
        points.append((-2.94+i*.208, .28, 1.42+row*.23+math.sin(i*.65+row)*.028))
    for i in range(20):
        branch('Fine water caustic', points[i], points[i+1], .004, foam)

# Linen loungers, bent backrests, sofa and a low stone table.
for x in [2.25, 3.36]:
    box('Lounger chestnut base', (.65, .10, 1.33), (x, .29, 2.02), wood, .022, 2)
    box('Lounger linen cushion', (.59, .11, 1.19), (x, .40, 2.04), linen, .045, 3)
    back = box('Lounger adjustable back', (.59, .09, .44), (x, .52, 1.58), linen, .025, 2)
    back.rotation_euler.x = math.radians(22)
    for z in [1.59, 2.43]:
        box('Lounger foot', (.50, .14, .065), (x, .21, z), wood)
box('Outdoor sofa wood platform', (1.22, .13, .73), (3.04, .37, -1.05), wood, .023, 2)
box('Outdoor sofa linen seat', (1.14, .16, .65), (3.04, .51, -1.05), linen, .045, 3)
box('Outdoor sofa linen back', (1.19, .44, .14), (3.04, .64, -1.40), linen, .038, 3)
box('Low travertine table', (.69, .11, .53), (3.03, .39, .05), travertine, .035, 3)
box('Table pedestal', (.34, .23, .30), (3.03, .245, .05), limestone, .014)


def pine(x, z, height, scale):
    branch('Umbrella pine trunk', (x, .15, z), (x+.13, height-.09, z-.05), .059*scale)
    for i in range(6):
        angle = i*2.4
        tip = (x+.13+math.cos(angle)*.34*scale, height-.16+(i%2)*.11, z-.05+math.sin(angle)*.34*scale)
        branch('Umbrella pine branch', (x+.08, height*.66, z), tip, .027*scale)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=1, location=xyz(*tip))
        obj = bpy.context.object
        obj.scale = (.50*scale, .45*scale, .22*scale)
        obj.rotation_euler.z = angle
        finish(obj, 'Sculpted umbrella pine crown', leaves[i%3])
        for poly in obj.data.polygons:
            poly.use_smooth = True
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=.29*scale, depth=.14, location=xyz(x,.20,z))
    finish(bpy.context.object, 'Pine stone planting ring', limestone, .02, 2)
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=.24*scale, depth=.016, location=xyz(x,.28,z))
    finish(bpy.context.object, 'Pine planting earth', earth)


pine(-3.86, .34, 2.44, 1.08)
pine(3.76, -2.79, 2.82, .96)
pine(-3.66, -2.82, 2.64, .84)

# Merge by material: an intentionally compact real Blender-authored web asset.
bpy.ops.object.select_all(action='DESELECT')
groups = {}
for obj in models:
    groups.setdefault(obj.data.materials[0].name, []).append(obj)
joined = []
for name, objects in groups.items():
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    obj = bpy.context.object
    obj.name = name
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    joined.append(obj)
triangles = sum(sum(len(p.vertices)-2 for p in obj.data.polygons) for obj in joined)
for obj in joined:
    obj['created_with'] = 'Blender 5.2 / Inastia architectural model'

# Export only model meshes, with Blender Z-up converted to glTF Y-up.
bpy.ops.object.select_all(action='DESELECT')
for obj in joined:
    obj.select_set(True)
bpy.ops.export_scene.gltf(filepath=str(MODEL), export_format='GLB', use_selection=True,
                          export_yup=True, export_cameras=False, export_lights=False,
                          export_animations=False, export_extras=True)

# Studio source includes a camera and lights; those are deliberately absent in GLB.
world = bpy.data.worlds.new('Dark sea studio')
bpy.context.scene.world = world
world.use_nodes = True
world.node_tree.nodes['Background'].inputs[0].default_value = (.085, .115, .14, 1)
world.node_tree.nodes['Background'].inputs[1].default_value = .45


def area(name, loc, power, color, size):
    bpy.ops.object.light_add(type='AREA', location=xyz(*loc))
    lamp = bpy.context.object
    lamp.name = name
    lamp.data.energy = power
    lamp.data.color = color
    lamp.data.shape = 'DISK'
    lamp.data.size = size
    lamp.rotation_euler = (Vector(xyz(0,.8,0))-lamp.location).to_track_quat('-Z','Y').to_euler()


area('Warm Mediterranean key', (-4,9,6), 1550, (1,.87,.68), 6)
area('Sea sky fill', (5,6,-5), 1900, (.60,.81,1), 7)
area('Soft frontal fill', (3,5,8), 600, (1,.98,.91), 5)
bpy.ops.object.camera_add(location=xyz(11,9,13))
camera = bpy.context.object
camera.rotation_euler = (Vector(xyz(0,.8,0))-camera.location).to_track_quat('-Z','Y').to_euler()
camera.data.type = 'ORTHO'
camera.data.ortho_scale = 12.2
bpy.context.scene.camera = camera
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 32
scene.cycles.use_denoising = True
scene.render.resolution_x = 1100
scene.render.resolution_y = 900
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = str(EVIDENCE / 'inastia-villa-blender.png')
bpy.ops.wm.save_as_mainfile(filepath=str(EVIDENCE / 'inastia-villa.blend'))
print(f'INASTIA_MODEL meshes={len(joined)} triangles={triangles} bytes={MODEL.stat().st_size} blender={bpy.app.version_string}')
(EVIDENCE / 'villa-model-stats.txt').write_text(
    f'Blender {bpy.app.version_string}\nMeshes/material groups: {len(joined)}\nTriangles: {triangles}\nGLB bytes: {MODEL.stat().st_size}\nGLB: {MODEL}\n', encoding='utf8')
bpy.ops.render.render(write_still=True)
