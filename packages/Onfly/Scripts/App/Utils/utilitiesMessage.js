export function resizeWriteArea(
  event,
  self,
  globalContainer,
  writeAreaContainer,
  messageListContainer
) {
  // Redimensionne la zone de texte
  $(writeAreaContainer).height(0);

  const parent = $(self).parent();
  const paddingParent =
    parseInt(parent.css('paddingTop'), 10) + parseInt(parent.css('paddingBottom'), 10);
  let textareaHeight = self.scrollHeight + paddingParent;

  if (event.keyCode == 13 && event.type == 'keydown') {
    textareaHeight += parseInt($(self).css('line-height'), 10);
  }

  $(writeAreaContainer).height(textareaHeight);

  // Redimensionne la liste des messages
  const listMessageTotalheight =
    $(globalContainer).outerHeight() - $(writeAreaContainer).outerHeight();
  $(messageListContainer).outerHeight(listMessageTotalheight);

  // Affichage de la bar de scroll quand la zone de texte a atteint sa hauteur max
  // Sinon elle est invisible
  let overflow = 'hidden';
  if (self.scrollHeight > parseInt($(self).css('max-height'), 10)) {
    overflow = 'auto';
  }

  $(self).css('overflow', overflow);
}
