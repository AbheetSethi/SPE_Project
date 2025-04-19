from django.http import JsonResponse
from PIL import Image
import numpy as np
from skimage import transform
import tensorflow as tf
from django.views.decorators.csrf import csrf_exempt
from keras.layers import TFSMLayer

# Load Model using TFSMLayer (since it's a SavedModel format not supported by Keras 3 directly)
# retrieved_model = TFSMLayer(
#     "/home/abheet/.cache/huggingface/hub/models--Madhu45--Teledermatology_model/snapshots/db0ea0c01c086c92d9911209d57cf20ad0c83827",
#     call_endpoint="serving_default"
# )

retrieved_model = TFSMLayer(
    "/home/abheet/.cache/huggingface/hub/models--AbheetSethi--Teledermatology_model/snapshots/ddf13fc612dbd08e1b7861746743aa6800b15020",
    call_endpoint="serving_default"
)
print("Model Loaded.")

# Class labels for prediction
CLASS_NAMES = ['1. Enfeksiyonel', '2. Ekzama', '3. Akne', '4. Pigment', '5. Benign', '6. Malign']

def load_image(image_obj):
    image = Image.open(image_obj)
    image = np.array(image).astype('float32')
    image = transform.resize(image, (32, 32, 3))  # Resize to match model input shape
    image = np.expand_dims(image, axis=0)        # Add batch dimension
    return image

@csrf_exempt
def predict(request):
    image_file = request.FILES.get('image')
    print(image_file)
    if not image_file:
        return JsonResponse({'error': 'No image file provided.'}, status=500)

    try:
        input_image = load_image(image_file)
        print("Image Loaded.")

        # Perform prediction
        prediction = retrieved_model(input_image)
        print(prediction)
        output_tensor = list(prediction.values())[0]
        print("Output tensor:", output_tensor)
        score = tf.nn.softmax(output_tensor[0])
        print(score)
        predicted_class = CLASS_NAMES[np.argmax(score)]
        print(predicted_class)
        prediction_confidence = 100 * np.max(score)

        print(f"This image most likely belongs to {predicted_class} with a {prediction_confidence:.2f}% confidence.")

        return JsonResponse({
            "msg": "Successful Inference",
            "predicted_class": predicted_class,
            "confidence": float(prediction_confidence)
        }, status=200)

    except Exception as e:
        print("Error during inference:", e)
        return JsonResponse({"msg": "Inference Failed!!", "error": str(e)}, status=500)