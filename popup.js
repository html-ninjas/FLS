function openModal() {
  document.querySelector(".modal").classList.add("active");
  document.querySelector(".backdrop").classList.add("active");
}

function closeModal() {
  document.querySelector(".modal").classList.remove("active");
  document.querySelector(".backdrop").classList.remove("active");
}
function confirmModal() {
  closeModal();
  console.log(2);
}
