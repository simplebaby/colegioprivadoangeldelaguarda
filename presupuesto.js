document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('presupuestoForm');
    const presupuestoTotal = document.getElementById('presupuestoTotal');
    const producto = document.getElementById('producto');
    const plazo = document.getElementById('plazo');
    const extras = document.querySelectorAll('[type="checkbox"]');

    const calcularPresupuesto = () => {
        let total = parseFloat(producto.value);
        extras.forEach(extra => {
            if (extra.checked) {
                total += parseFloat(extra.value);
            }
        });

        const descuento = parseInt(plazo.value) * 10; // $10 de descuento por mes
        total -= descuento;

        presupuestoTotal.textContent = `Total: $${total < 0 ? 0 : total}`;
    };

    producto.addEventListener('change', calcularPresupuesto);
    plazo.addEventListener('input', calcularPresupuesto);
    extras.forEach(extra => extra.addEventListener('change', calcularPresupuesto));

    form.addEventListener('submit', e => {
        e.preventDefault();

        // Validaciones
        const nombre = document.getElementById('nombre').value.trim();
        const apellidos = document.getElementById('apellidos').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const email = document.getElementById('email').value.trim();
        const condiciones = document.getElementById('condiciones').checked;

        const regexNombre = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,15}$/;
        const regexApellidos = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]{1,40}$/;
        const regexTelefono = /^\d{9}$/;
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !regexNombre.test(nombre) ||
            !regexApellidos.test(apellidos) ||
            !regexTelefono.test(telefono) ||
            !regexEmail.test(email) ||
            !condiciones
        ) {
            alert('Por favor, rellena todos los campos correctamente.');
            return;
        }

        alert('Formulario enviado correctamente.');
    });
});
