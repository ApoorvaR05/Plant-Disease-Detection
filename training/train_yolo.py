import os
from ultralytics import YOLO

def train_model():
    """
    Train a YOLOv11 model for Plant Disease Classification.
    Make sure you have run format_dataset.py first!
    """
    
    # 1. Load a pre-trained YOLOv11 classification model
    # 'yolo11n-cls.pt' is the nano model - it's fast and lightweight.
    # You can also use 'yolo11s-cls.pt' (small) or 'yolo11m-cls.pt' (medium) for better accuracy.
    print("Loading YOLOv11 model...")
    model = YOLO('yolo11n-cls.pt')  

    # 2. Train the model
    # Note: For classification, YOLO expects the 'data' argument to be the ROOT FOLDER
    # containing 'train' and 'val' subdirectories. It also prefers absolute paths.
    dataset_path = os.path.abspath('./yolo_cls_dataset')
    print("Starting training on dataset:", dataset_path)
    
    # We apply severe data augmentations to strictly teach the model to ignore background noise
    # and focus on the disease textures, enforcing extreme high accuracy (precision).
    results = model.train(
        data=dataset_path,         # Absolute path to the generated dataset folder
        epochs=50,                 # Increased to 50 loops to fully learn the complex augmentations
        imgsz=224,                 # Standard image size for classification
        batch=32,                  # How many images to process at once (lower if out of memory)
        name='plant_disease_model',# Name of the output folder in 'runs/classify/'
        
        # --- ROBUST REAL-WORLD AUGMENTATIONS ---
        erasing=0.4,               # Randomly erase parts of the image (forces model to not rely on obvious spots)
        degrees=15.0,              # Rotate images by up to +/- 15 degrees
        translate=0.1,             # Translate/shift images strictly by 10%
        scale=0.5,                 # Zoom in/out heavily (50% scale variance)
        fliplr=0.5,                # Flip 50% randomly horizontally
        flipud=0.2,                # Flip 20% randomly vertically (leaves can be at any angle in real photos)
        hsv_h=0.015,               # Minor color adjustments (hue)
        hsv_s=0.7,                 # Major saturation adjustments (lighting condition resilience)
        hsv_v=0.4,                 # Brightness adjustments (sunny vs shadow capturing)
        dropout=0.2                # Classification neural dropout for preventing overfitting
    )

    print("\nTraining complete!")
    print("Your trained model weights are located at: runs/classify/plant_disease_model/weights/best.pt")
    print("Copy 'best.pt' directly into your backend/ folder to use it with the web app!")

if __name__ == '__main__':
    train_model()
