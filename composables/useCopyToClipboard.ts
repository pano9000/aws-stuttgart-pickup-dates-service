export function useCopyToClipboard() {

  const copiedToClipboard = ref<boolean>(false);

  const copyToClipboardHandler = (textToWrite: string) => {
    copiedToClipboard.value = true;
    navigator.clipboard.writeText(textToWrite);
    setTimeout( () => copiedToClipboard.value = false, 1000)
  }

  return {
    copiedToClipboard,
    copyToClipboardHandler
  }
}