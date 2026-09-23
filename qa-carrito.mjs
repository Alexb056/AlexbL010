export default async function run(page, ui) {

  const leerTotal = () => page.locator('.total-carrito').innerText();

  // 1. Total inicial
  const totalInicial = await leerTotal();

  // 2. Agregar dos productos distintos
  await page.locator('#lista-productos button:has-text("Agregar al Carrito")').first().click();
  await page.locator('#lista-productos button:has-text("Agregar al Carrito")').nth(1).click();
  await page.waitForTimeout(300);
  const totalConProductos = await leerTotal();

  // 3. Mostrar el carrito (solo es visible en :hover)
  await page.locator('.carrito').hover();
  await page.waitForTimeout(200);

  // 4. Sumar cantidad (+)
  await page.locator('#carrito button[data-accion="sumar"]').first().click();
  await page.waitForTimeout(300);
  const totalTrasSumar = await leerTotal();

  // 5. Vaciar carrito
  await page.locator('#carrito button[data-accion="vaciar"]').click();
  await page.waitForTimeout(300);
  const totalTrasVaciar = await leerTotal();
  const mensaje = await page.locator('#carrito > p').first().innerText();
  const tablaOculta = await page.locator('#carrito table').evaluate(el => el.style.display === 'none');

  return { totalInicial, totalConProductos, totalTrasSumar, totalTrasVaciar, mensaje, tablaOculta };
}
