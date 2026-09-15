# Walkthrough: Super Usuario y Gestión de Señas

Se han implementado las mejoras solicitadas para el control total de mesas por super usuarios y la gestión eficiente de señas en el panel de administración.

## Cambios Realizados

### 1. Acceso de Super Usuario (Mapa Público)
*   **Acceso Oculto**: Para activar el modo maestro, toca **7 veces** el texto "CUBANO BAR" en la parte superior del mapa.
*   **Seguridad**: Se solicitará la contraseña `zarate1984`. Los correos autorizados son `moyanojl.1984@gmail.com` y `gncesso@gmail.com`.
*   **Control Maestro**: Una vez activado, al tocar cualquier mesa (esté libre o no), se abre un panel especial que permite cambiar el estado de la mesa a **Libre**, **Pendiente**, **Vendida** o **Ingresada** con un solo clic.

### 2. Unificación Visual
*   En el mapa que ven los clientes, las mesas marcadas como **INGRESADAS** ahora se muestran en **ROJO** (como vendidas). Esto evita confusiones para el público, mientras que en la boletería se siguen viendo azules.

### 3. Edición Masiva de Señas (Panel Admin)
*   En el listado de reservas del Panel de Admin, ahora verás un cuadro de texto al lado de cada nombre para la seña.
*   Puedes editar varios montos a la vez.
*   Al terminar, presiona el botón azul **"GUARDAR CAMBIOS"** que aparece en la barra superior.
*   Estos montos se sincronizan automáticamente con la calculadora de la Boletería.

## Verificación
*   [x] Acceso oculto mediante clics probado.
*   [x] Cambio de estado maestro sin formularios verificado.
*   [x] Persistencia de montos de seña en Admin y Boletería confirmada.
*   [x] Mesas ingresadas se visualizan rojas en el mapa público.
