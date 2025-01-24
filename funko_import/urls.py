from django.urls import path, include
from rest_framework import routers
from . import views
from .views import create_preference

router = routers.DefaultRouter()
# router.register(r'Coleccion', views.ColeccionView, 'Coleccion')

router.register(r'Usuario', views.UsuarioView, 'Usuario')
router.register(r'Coleccion', views.ColeccionView, 'Coleccion')
router.register(r'Carrito', views.CarritoView, 'Carrito')
router.register(r'Descuento', views.DescuentoView, 'Descuento')
router.register(r'Producto', views.ProductoView, 'Producto')
router.register(r'Promocion', views.PromocionView, 'Promocion')
router.register(r'resenaComentario', views.resenaComentarioView, 'resenaComentario')
router.register(r'pregunta', views.preguntaView, 'Pregunta')

urlpatterns = [
    path('api/', include(router.urls)),
    path("create_preference/", create_preference, name="create_preference"),
]