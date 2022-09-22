
const sw = document.getElementById('sw')
const colorPicker = document.getElementById('color')

const callback = () => {
  window.api.send('light-config-updated', {
    sw: sw.value,
    color: colorPicker.value,
  });
};

colorPicker.addEventListener('change', callback);
sw.addEventListener('change', callback);
