const button = document.querySelector('button')
const input = document.querySelector('input')

button.addEventListener('click', () => {
  if (input.value !== '') {
    window.location.href = '/search?q=' + input.value
  }
})

input.addEventListener('keyup', (e) => {
  if (e.code === 'Enter' && input.value !== '') {
    window.location.href = '/search?q=' + input.value
  }
})
