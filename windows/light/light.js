const lightShape = document.getElementById('light-shape')

window.api.receive('light-config-updated', (args) => {
  lightShape.setAttribute("stroke", args.color)
  lightShape.setAttribute("stroke-width", args.sw + "%")
})