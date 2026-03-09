from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# --- CONFIGURACIÓN ---
# REEMPLAZA CON TU IP PÚBLICA DE AWS (Dejé la de tu contexto, pero si cambió actualízala)
AWS_IP = "http://3.224.5.201" 

# Configuración del navegador
options = webdriver.ChromeOptions()
# options.add_argument('--headless') # Descomenta esto si quieres que sea invisible (Para AWS EC2)
driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

try:
    print(f"🚀 Iniciando ataque... digo, prueba en {AWS_IP}")
    driver.get(AWS_IP)
    driver.maximize_window()

    # 1. Esperar a que cargue el Home y buscar el botón de Login
    print("👀 Buscando botón de acceso...")
    wait = WebDriverWait(driver, 10)
    
    # Buscar el enlace de inicio de sesión (Ajustado al frontend real de Next.js)
    login_btn = wait.until(EC.element_to_be_clickable((By.XPATH, "//a[contains(text(), 'Entrar') or contains(text(), 'INGRESAR')]")))
    login_btn.click()

    # 2. Llenar el formulario de Auth
    print("⌨️ Escribiendo credenciales...")
    
    # Adaptado a los names clásicos de react-hook-form
    email_input = wait.until(EC.presence_of_element_located((By.NAME, "email")))
    # Usando el usuario proporcionado por el desarrollador
    email_input.send_keys("josemadero123@gmail.com")
    
    driver.find_element(By.NAME, "password").send_keys("Josepro123")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    # 3. Verificar Dashboard y Autenticación
    print("✅ Verificando entrada al Dashboard...")
    time.sleep(3) # Un respiro vital para que Next.js y NestJS validen el JWT
    
    if "dashboard" in driver.current_url.lower():
        print("🎉 ¡ÉXITO! El bot entró a la tienda en AWS de forma autónoma.")
    else:
        print("❌ Algo falló, no llegamos al dashboard. Tomando captura de pantalla...")
        driver.save_screenshot("tienditacampus-tests/error_login.png")
        print("📸 Captura guardada como 'error_login.png' en la carpeta tienditacampus-tests.")
        print(f"La URL final donde se quedó atascado es: {driver.current_url}")

finally:
    time.sleep(5) # Para que te dé tiempo de admirar tu obra
    driver.quit()
