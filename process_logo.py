from PIL import Image
import numpy as np
import sys

def remove_background(input_path, output_path, tolerance=30):
    print(f"Processing {input_path}...")
    try:
        img = Image.open(input_path).convert("RGBA")
        print(f"Image opened. Size: {img.size}")
        
        datas = img.getdata()
        print("Data loaded.")
        
        # Sample the top-left pixel
        bg_color = datas[0]
        print(f"Background color: {bg_color}")
        
        newData = []
        count = 0
        total = len(datas)
        
        for item in datas:
            # Calculate Euclidean distance
            dist = np.sqrt(sum([(a - b) ** 2 for a, b in zip(item[:3], bg_color[:3])]))
            
            if dist < tolerance:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
            
            count += 1
            if count % 100000 == 0:
                print(f"Processed {count}/{total} pixels...", end='\r')
        
        print("\nPixels processed.")
        img.putdata(newData)
        
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            print(f"Cropped to {bbox}")
        
        if img.height > 200:
            ratio = 200 / img.height
            new_width = int(img.width * ratio)
            img = img.resize((new_width, 200), Image.Resampling.LANCZOS)
            print(f"Resized to {img.size}")

        img.save(output_path, "PNG")
        print(f"Success: {output_path} created.")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    remove_background('inastia_logo.jfif', 'logo.png', tolerance=40)
