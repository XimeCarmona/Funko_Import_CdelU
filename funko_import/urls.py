from django.urls import path, include
from rest_framework import routers
from . import views
from .views import process_payment
from .views import google_login 

router = routers.DefaultRouter()
# router.register(r'Coleccion', views.ColeccionView, 'Coleccion')

router.register(r'Usuario', views.UsuarioView, 'Usuario')
router.register(r'Coleccion', views.ColeccionView, 'Coleccion')
router.register(r'Carrito', views.CarritoView, 'Carrito')
router.register(r'Descuento', views.DescuentoView, 'Descuento')
router.register(r'productos', views.ProductoView, 'producto') 
router.register(r'Promocion', views.PromocionView, 'Promocion')
router.register(r'resenaComentario', views.resenaComentarioView, 'resenaComentario')
router.register(r'pregunta', views.preguntaView, 'Pregunta')

urlpatterns = [
    path('api/', include(router.urls)),
    path("process_payment/", process_payment, name="process_payment"),
    # path("google_login/", google_login, name="google_login"),
    path('google', views.google_login, name='google-login'),
]