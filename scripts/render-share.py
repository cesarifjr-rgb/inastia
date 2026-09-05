"""Render the social card using the Blender villa created by create-villa.py.

Run: blender --background --python scripts/render-share.py
The source is our generated evidence file, never an open user scene.
"""
import bpy
import shutil
import subprocess
from pathlib import Path
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT.parent / 'inastia-v2-evidence'
SOURCE = EVIDENCE / 'inastia-villa.blend'
OUTPUT = ROOT / 'public' / 'images' / 'inastia-share.png'
if not SOURCE.is_file():
    raise FileNotFoundError('Run scripts/create-villa.py in Blender first.')
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=str(SOURCE))
scene = bpy.context.scene
camera = scene.camera
camera.data.ortho_scale = 20.8
camera.data.shift_x = -.18
scene.render.resolution_x = 1200
scene.render.resolution_y = 630
scene.render.resolution_percentage = 100
scene.render.film_transparent = False
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGB'
scene.render.image_settings.color_depth = '8'
scene.render.image_settings.compression = 100
scene.render.filepath = str(OUTPUT)
scene.render.engine = 'CYCLES'
scene.cycles.samples = 48
scene.cycles.use_denoising = True
for obj in scene.objects:
    if obj.type == 'LIGHT':
        obj.data.energy *= .55


def linear(c):
    return c / 12.92 if c <= .04045 else ((c+.055)/1.055)**2.4


def emission(name, hex_color):
    rgb = tuple(linear(int(hex_color[i:i+2], 16)/255) for i in (0,2,4))
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    shader = nodes.new('ShaderNodeEmission')
    shader.inputs[0].default_value = (*rgb,1)
    shader.inputs[1].default_value = 1
    mat.node_tree.links.new(shader.outputs[0], output.inputs[0])
    return mat


# Film-plane background and typography are themselves Blender geometry. This keeps
# exact sRGB colours and readable typography independent of studio illumination.
background = emission('Card background #081418', '081418')
white = emission('Warm white typography', 'ecefe9')
muted = emission('Sea mist typography', '9fb9b7')
accent = emission('Soft aqua line', '8ebdc0')
scene.view_settings.view_transform = 'Standard'
scene.view_settings.look = 'None'
scene.view_settings.exposure = 0
scene.view_settings.gamma = 1

# A huge plane behind the diorama, parallel to the camera.
bpy.ops.mesh.primitive_plane_add(size=200)
backdrop = bpy.context.object
backdrop.name = 'Social card dark backdrop'
backdrop.parent = camera
backdrop.location = (0, 0, -40)
backdrop.rotation_euler = (0,0,0)
backdrop.data.materials.append(background)
backdrop.visible_shadow = False

corners = camera.data.view_frame(scene=scene)
left = min(v.x for v in corners)
top = max(v.y for v in corners)
font_path = Path('C:/Windows/Fonts/arial.ttf')
bold_path = Path('C:/Windows/Fonts/arialbd.ttf')
font = bpy.data.fonts.load(str(font_path)) if font_path.exists() else None
bold = bpy.data.fonts.load(str(bold_path)) if bold_path.exists() else font


def text(name, content, x, y, size, mat, face=None, spacing=1):
    curve = bpy.data.curves.new(name, 'FONT')
    curve.body = content
    curve.size = size
    curve.space_character = spacing
    curve.align_x = 'LEFT'
    curve.align_y = 'BOTTOM_BASELINE'
    curve.resolution_u = 12
    if face:
        curve.font = face
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    obj.parent = camera
    obj.location = (x,y,-7)
    obj.rotation_euler = (0,0,0)
    curve.materials.append(mat)
    obj.visible_shadow = False
    return obj


x = left + .86
text('Inastia wordmark', 'INASTIA', x, top-1.43, .72, white, bold, 1.24)
text('Business descriptor', 'CONCIERGERIE EN CORSE', x, top-2.11, .245, muted, font, 1.13)
text('Headline first line', 'Votre maison.', x, top-3.97, .77, white, font)
text('Headline second line', 'L’esprit au large.', x, top-4.98, .77, white, font)
text('Website address', 'inastia.fr', x, -top+1.09, .26, muted, font, 1.06)
# A delicate graphic rule balances the intentionally spare composition.
bpy.ops.mesh.primitive_plane_add(size=1)
rule = bpy.context.object
rule.name = 'Editorial aqua rule'
rule.parent = camera
rule.location = (x+.36,top-2.77,-7)
rule.rotation_euler = (0,0,0)
rule.scale = (.72,.018,1)
rule.data.materials.append(accent)
rule.visible_shadow = False

bpy.ops.wm.save_as_mainfile(filepath=str(EVIDENCE / 'inastia-share.blend'))
bpy.ops.render.render(write_still=True)
# Palette encoding only: pixels are rendered entirely in Blender, then compacted
# by the existing project image library for an efficient social preview.
if shutil.which('node'):
    subprocess.run(['node', '--input-type=module', '-e', """
import sharp from 'sharp';
import fs from 'node:fs/promises';
const path = process.argv[1];
const source = await fs.readFile(path);
const compact = await sharp(source).png({palette:true,colours:256,dither:0.25,effort:10,compressionLevel:9}).toBuffer();
await fs.writeFile(path,compact);
""", str(OUTPUT)], cwd=str(ROOT), check=True)
print(f'INASTIA_SHARE {OUTPUT} bytes={OUTPUT.stat().st_size} size=1200x630 Blender={bpy.app.version_string}')
