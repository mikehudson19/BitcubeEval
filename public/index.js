const login = document.querySelector('.login__btn');
const check = document.querySelector('#remember');
const email = document.querySelector('.login__input')


login.addEventListener('click', () => {
  if (check.checked) {
    localStorage.setItem('email', email.value);
  } else if (!check.checked) {
    localStorage.removeItem('email');
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const userEmail = localStorage.getItem('email');
  email.value = userEmail;
});