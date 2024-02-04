const updateCart = (state: any) => {
  localStorage.setItem("cart", JSON.stringify(state));
}