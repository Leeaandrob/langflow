import os

import requests

from langflow.custom import Component
from langflow.inputs import MessageInput
from langflow.template.field.base import Output


class TelaAvatarModelComponent(Component):
    display_name = "Tela Avatar Generation"
    description = "Generates talking head by text using Tela Avatar models."
    icon = "Tela"
    name = "TelaAvatar"

    inputs = [
        MessageInput(
            name="prompt",
            display_name="Prompt used for text to speach generation",
            info="The script will used on voice to lipsync.",
        )
    ]

    outputs = [
        Output(display_name="", name="video", method="get_video"),
    ]

    def get_video(self) -> str:
        output = self.build_model()
        self.status = output
        print("--->", output)
        return output

    def build_model(self) -> str:  # type: ignore[type-var]
        tts = self.prompt.data.get("text")
        url = "http://150.136.115.216:8000/generate"
        data = {
            "pose_style": 0,
            "enhancer": "false",
            "batch_size": 1,
            "length_of_audio": 5,
            "preprocess_type": "crop",
            "is_still_mode": "false",
            "size_of_image": 512,
            "tts": tts,
            "facerender": "facevid2vid",
            "use_idle_mode": "false",
            "blink_every": "true",
            "ref_info": "pose",
            "exp_weight": 1,
        }
        path = os.path.dirname(os.path.abspath(__file__))
        files = {
            "source_image": ("sam.png", open(f"{path}/sam.png", "rb"), "image/png"),
        }

        response = requests.post(url, data=data, files=files)

        if response.status_code == 200:
            data = response.json()
            return data.get("url")
        else:
            raise Exception(f"Failed to generate video: {response.content}")
