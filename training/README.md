# How to Train the YOLOv11 Model

I have set up the Python scripts you need to take raw images from Kaggle (or anywhere) and train your own YOLOv11 classification model for your React+Flask web app!

### Step 1: Add your Raw Images
1. Create a folder here named `raw_dataset/`.
2. Inside `raw_dataset/`, add folders for each of your diseases.
   * Example: `raw_dataset/Potato___Early_blight/`
   * Example: `raw_dataset/Tomato___Healthy/`
3. Put all your `.jpg` or `.png` images inside their respective folders.

### Step 2: Format the Dataset for YOLO
YOLOv11 requires images to be separated into `train/` and `val/` sets.
Run this script to automatically shuffle and sort your images into a new folder called `yolo_cls_dataset`:

```bash
python format_dataset.py
```

### Step 3: Train the Model
Make sure you have `ultralytics` installed via pip. Then, run the training script. This script uses the lightweight `yolo11n-cls.pt` model to train quickly on your dataset for 20 epochs.

```bash
python train_yolo.py
```

### Step 4: Integrate with Web App
When training finishes successfully (it takes time depending on your GPU!), look at the output logs in your terminal.
1. It will tell you where it saved the final weights, usually: `runs/classify/plant_disease_model/weights/best.pt`.
2. Copy `best.pt`.
3. Paste it directly into the `../backend/` folder!
4. Open `backend/model_utils.py` and remove the dummy logic and uncomment the YOLO lines.
5. Your web UI will now magically use your customized model!
