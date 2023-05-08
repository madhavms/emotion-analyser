import text2emotion as te

text = "Im not happy today"


def annotate_emotion(text):
    print('Entered annotate_emotion')
    prediction = te.get_emotion(text)
    intensity = max(prediction.values())
    emotion = next(key for key, value in prediction.items() if value == intensity)
    print(f'Text: {text}, Emotion: {emotion}, Intensity: {intensity}')
    return (emotion, intensity)

annotate_emotion(text)