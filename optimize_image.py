from PIL import Image
import os

def optimize_image(input_path, output_path, max_width=800):
    try:
        with Image.open(input_path) as img:
            # Resize if too large
            if img.width > max_width:
                ratio = max_width / img.width
                new_height = int(img.height * ratio)
                img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
            # Save as WebP
            img.save(output_path, 'WEBP', quality=85)
            print(f"Success: {input_path} -> {output_path}")
            
            # Print sizes
            original_size = os.path.getsize(input_path) / 1024
            new_size = os.path.getsize(output_path) / 1024
            print(f"Original: {original_size:.2f} KB")
            print(f"Optimized: {new_size:.2f} KB")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    optimize_image('residence_san_ciprianu.jfif', 'residence_san_ciprianu.webp')
