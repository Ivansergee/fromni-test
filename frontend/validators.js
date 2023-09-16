export function validateMsg(msg, params) {
  const constraints = params.find()
}

const msgPayload = {
    campId: this.campId,
    msngrId: this.msngr.id,
    text: this.message,
    kbType: this.kbType
};

[
    {
        "id": 1,
        "name": "Telegram",
        "max_chars": 4096,
        "kb_std_enabled": true,
        "kb_std_max_buttons": 0,
        "kb_std_max_button_len": 0,
        "kb_std_links_enabled": false,
        "kb_inline_enabled": true,
        "kb_inline_max_buttons": 0,
        "kb_inline_max_button_len": 64,
        "kb_inline_links_enabled": true
    },
    {
        "id": 2,
        "name": "VK",
        "max_chars": 4096,
        "kb_std_enabled": true,
        "kb_std_max_buttons": 40,
        "kb_std_max_button_len": 0,
        "kb_std_links_enabled": true,
        "kb_inline_enabled": true,
        "kb_inline_max_buttons": 10,
        "kb_inline_max_button_len": 0,
        "kb_inline_links_enabled": true
    }
]