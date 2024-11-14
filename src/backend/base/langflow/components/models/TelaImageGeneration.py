import requests

from langflow.field_typing.range_spec import RangeSpec
from langflow.custom import Component
from langflow.inputs import MessageInput
from langflow.inputs import (
    FloatInput,
    IntInput,
)
from langflow.template.field.base import Output


class TelaImageModelComponent(Component):
    display_name = "Tela Image Generation"
    description = "Generates image by text using Tela Image models."
    icon = "Tela"
    name = "TelaImage"

    inputs = [
        MessageInput(
            name="prompt",
            display_name="Prompt used for image generation",
            info="The prompt used for image generation.",
        ),
        IntInput(
            name="height",
            display_name="Height",
            info="The height used for image generation.",
            range_spec=RangeSpec(min=800, max=1280),
        ),
        IntInput(
            name="width",
            display_name="Width",
            info="The width used for image generation.",
            range_spec=RangeSpec(min=800, max=1920),
        ),
        FloatInput(name="guidance_scale", display_name="Guidance scale", value=7.5),
        IntInput(
            name="seed",
            display_name="Seed",
            info="The seed controls the reproducibility of the job.",
            advanced=True,
            value=1,
        ),
    ]

    outputs = [
        Output(display_name="", name="images", method="get_images"),
    ]

    def get_images(self) -> str:
        output = self.build_model()
        self.status = output
        return output

    def build_model(self) -> str:  # type: ignore[type-var]
        api_base = "https://t2i.fanheroapi.com/text-to-image"
        prompt = self.prompt.data.get("text")
        width = self.width
        height = self.height
        seed = self.seed
        guidance_scale = self.guidance_scale

        response = requests.post(
            api_base,
            json={"prompt": prompt, "width": width, "height": height, "seed": seed, "guidance_scale": guidance_scale},
        )
        data = response.json()
        return data.get("images")[0].get("url")
