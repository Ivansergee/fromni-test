export function validateMessages(messages, params) {
  let errors = [];

  if (messages.length === 0) {
    errors.push({messenger: '', field: '', error: 'Не выбран ни один канал'});
  }
  
  for (const message of messages) {
    const constraints = params.find((param) => param.id === message.messengerId);

    if (messages.filter(msg => msg.order === message.order).length !== 1) {
      errors.push({messenger: constraints.name, field: 'Порядок отправки', error: 'Порядок отправки указан неверно'});
    }
    
    if (message.text.length === 0) {
      errors.push({messenger: constraints.name, field: 'Сообщение', error: 'Сообщение не может быть пустым'});
    }

    if (message.text.length > constraints.max_chars && constraints.max_chars !== 0) {
      errors.push({messenger: constraints.name, field: 'Сообщение', error: 'Превышен максимальный размер сообщения'});
    }
      
    if ((message.kbType === 'std' && !constraints.kb_std_enabled) || (message.kbType === 'inline' && !constraints.kb_inline_enabled)) {
      errors.push({messenger: constraints.name, field: 'Клавиатура', error: 'Этот тип клавиатуры не поддерживается каналом'});
    }

    if (message.kbType === 'std' && constraints.kb_std_max_buttons !== 0 && constraints.kb_std_max_buttons < message.buttons.length) {
      errors.push({
        messenger: constraints.name,
        field: 'Клавиатура',
        error: `Превышено допустимое количество кнопок для стандартной клавиатуры в ${constraints.name} (${constraints.kb_std_max_buttons}) `
      });
    }

    if (message.kbType === 'inline' && constraints.kb_inline_max_buttons !== 0 && constraints.kb_inline_max_buttons < message.buttons.length) {
      errors.push({
        messenger: constraints.name,
        field: 'Клавиатура',
        error: `Превышено допустимое количество кнопок для inline клавиатуры в ${constraints.name} (${constraints.kb_inline_max_buttons}) `
      });
    }

    if (message.kbType === 'std' && constraints.kb_std_max_links !== 0 && constraints.kb_std_max_links < message.buttons.filter(button => button.type === 'link')) {
      errors.push({
        messenger: constraints.name,
        field: 'Клавиатура',
        error: `Превышено допустимое количество кнопок-ссылок для стандартной клавиатуры в ${constraints.name} (${constraints.kb_std_max_links}) `
      });
    }

    if (message.kbType === 'inline' && constraints.kb_inline_max_links !== 0 && constraints.kb_inline_max_links < message.buttons.filter(button => button.type === 'link')) {
      errors.push({
        messenger: constraints.name,
        field: 'Клавиатура',
        error: `Превышено допустимое количество кнопок-ссылок для inline клавиатуры в ${constraints.name} (${constraints.kb_inline_max_links}) `
      });
    }

    
    if (message.buttons) {
      for (const button of message.buttons) {
        if (button.text.length === 0) {
          errors.push({messenger: constraints.name, field: 'Кнопка', error: 'Не задан текст кнопки'});
          continue
        }
  
        if (message.kbType === 'std' && constraints.kb_std_max_button_len !== 0 && constraints.kb_std_max_button_len < button.text.length) {
          errors.push({
            messenger: constraints.name,
            field: 'Кнопка',
            error: `Текст кнопки превышает допустимое значение для стандартной клавиатуры в ${constraints.name}`
          });
        }
  
        if (message.kbType === 'inline' && constraints.kb_inline_max_button_len !== 0 && constraints.kb_inline_max_button_len < button.text.length) {
          errors.push({
            messenger: constraints.name,
            field: 'Кнопка',
            error: `Текст кнопки превышает допустимое значение для inline клавиатуры в ${constraints.name}`
          });
        }
  
        if (message.kbType === 'std' && !constraints.kb_std_links_enabled && button.type === 'link') {
          errors.push({
            messenger: constraints.name,
            field: 'Кнопка',
            error: `Кнопки-ссылки не разрешены для стандартной клавиатуры в ${constraints.name}`
          });
        }
  
        if (message.kbType === 'inline' && !constraints.kb_inline_links_enabled && button.type === 'link') {
          errors.push({
            messenger: constraints.name,
            field: 'Кнопка',
            error: `Кнопки-ссылки не разрешены для inline клавиатуры в ${constraints.name}`
          });
        }
      }
    }
  }

  return errors
}