from django.urls import path, include
from rest_framework import routers
from . import views
from .views import process_payment
from .views import google_login 

router = routers.DefaultRouter()
# router.register(r'Coleccion', views.ColeccionView, 'Coleccion')

router.register(r'usuarios', views.UsuarioView, basename='usuario')
router.register(r'colecciones', views.ColeccionView, basename='coleccion')
router.register(r'carritos', views.CarritoView, basename='carrito')
router.register(r'descuentos', views.DescuentoView, basename='descuento')
router.register(r'productos', views.ProductoView, basename='producto')
router.register(r'promociones', views.PromocionView, basename='promocion')
router.register(r'resenas', views.resenaComentarioView, basename='resena')
router.register(r'preguntas', views.preguntaView, basename='pregunta')
router.register(r'ediciones', views.EdicionView, basename='edicion')

urlpatterns = [
    # path('api/', include(router.urls)),
    path('', include(router.urls)),
    path("process_payment/", process_payment, name="process_payment"),
    # path("google_login/", google_login, name="google_login"),
    path('auth/google', views.google_login, name='google-login'),
]