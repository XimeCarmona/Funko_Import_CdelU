from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Usuario, Coleccion, carrito, Descuento, Producto, Promocion, IngresoStock, PeticionProducto, ResenaComentario, Pregunta, CarritoDescuento, Factura, LineaFactura, FacturaDescuento, ProductoCarrito, CodigoSeguimiento
from django.views.generic import CreateView, TemplateView
from .serializers import UsuarioSerializer, ColeccionSerializer, CarritoSerializer, DescuentoSerializer, ProductoSerializer, PromocionSerializer, IngresoStockSerializer, PeticionProductoSerializer, ResenaComentarioSerializer, PreguntaSerializer, CarritoDescuentoSerializer, FacturaSerializer, LineaFacturaSerializer, FacturaDescuentoSerializer, ProductoCarritoSerializer, CodigoSeguimientoSerializer
from .forms import UsuarioForm, ColeccionForm, DescuentoForm, productoForm, promocionForm, IngresoStockForm, PeticionProductoForm, ResenaComentarioForm, PreguntaForm, RespuestaForm
from django.urls import reverse_lazy
from rest_framework import viewsets
import mercadopago
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.

#CRUDS
class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

class ColeccionView(viewsets.ModelViewSet): 
    serializer_class = ColeccionSerializer
    queryset = Coleccion.objects.all()

class CarritoView(viewsets.ModelViewSet): 
    serializer_class = CarritoSerializer
    queryset = carrito.objects.all()

class DescuentoView(viewsets.ModelViewSet): 
    serializer_class = DescuentoSerializer
    queryset = Descuento.objects.all()

class ProductoView(viewsets.ModelViewSet): 
    queryset = Producto.objects.all()

class PromocionView(viewsets.ModelViewSet):
    serializer_class = PromocionSerializer
    queryset = Promocion.objects.all()

class resenaComentarioView(viewsets.ModelViewSet): 
    serializer_class = ResenaComentarioSerializer
    queryset = ResenaComentario.objects.all()

class preguntaView(viewsets.ModelViewSet):
    serializer_class = PreguntaSerializer
    queryset = Pregunta.objects.all()

#GET ALL

def getUsuarios(request):
    usuarios = Usuario.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return JsonResponse(serializer.data, safe=False)

def getColecciones(request):
    colecciones = Coleccion.objects.all()
    serializer = ColeccionSerializer(colecciones, many=True)
    return JsonResponse(serializer.data, safe=False)

def getCarritos(request):
    carritos = carrito.objects.all()
    serializer = CarritoSerializer(carritos, many=True)
    return JsonResponse(serializer.data, safe=False)

def getDescuentos(request):
    descuentos = Descuento.objects.all()
    serializer = DescuentoSerializer(descuentos, many=True)
    return JsonResponse(serializer.data, safe=False)

def getProductos(request):
    productos = Producto.objects.all()
    serializer = ProductoSerializer(productos, many=True)
    return JsonResponse(serializer.data, safe=False)

def getPromociones(request):
    promociones = Promocion.objects.all()
    serializer = PromocionSerializer(promociones, many=True)
    return JsonResponse(serializer.data, safe=False)

def getResenasComentarios(request):
    resenasComentarios = ResenaComentario.objects.all()
    serializer = ResenaComentarioSerializer(resenasComentarios, many=True)
    return JsonResponse(serializer.data, safe=False)

def getPreguntas(request):
    preguntas = Pregunta.objects.all()
    serializer = PreguntaSerializer(preguntas, many=True)
    return JsonResponse(serializer.data, safe=False)

#REST
def UsuariosRest (request):
    usuario=getUsuarios()
    return JsonResponse(usuario)

def ColeccionesRest (request):
    coleccion=getColecciones()
    return JsonResponse(coleccion)

def CarritosRest (request):
    carrito=getCarritos()
    return JsonResponse(carrito)

def DescuentosRest (request):
    descuento=getDescuentos()
    return JsonResponse(descuento)

def ProductosRest (request):
    producto=getProductos()
    return JsonResponse(producto)

def PromocionesRest (request):
    promocion=getPromociones()
    return JsonResponse(promocion)

def ResenasComentariosRest (request):
    resenaComentario=getResenasComentarios()
    return JsonResponse(resenaComentario)

def PreguntasRest (request):
    pregunta=getPreguntas()
    return JsonResponse(pregunta)

#MercadoPago
# Credenciales de acceso (Access Token)
ACCESS_TOKEN = "token"

@csrf_exempt
def process_payment(request):
    if request.method == "POST":
        try:
            # Inicializar el SDK de Mercado Pago
            sdk = mercadopago.SDK(ACCESS_TOKEN)
            
            # Obtener los datos del cuerpo de la solicitud
            body = json.loads(request.body)

            # Crear el pago
            payment_data = {
                "transaction_amount": float(body["transaction_amount"]),
                "token": body["token"],
                "description": body["description"],
                "installments": int(body["installments"]),
                "payment_method_id": body["payment_method_id"],
                "payer": {
                    "email": body["payer"]["email"]
                }
            }

            # Procesar el pago
            payment_response = sdk.payment().create(payment_data)
            payment = payment_response["response"]

            # Retornar la respuesta del pago al cliente
            return JsonResponse({
                "status": payment.get("status"),
                "status_detail": payment.get("status_detail"),
                "id": payment.get("id"),
            })

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=400)

#Login Google
# from django.http import JsonResponse
# from django.core.exceptions import ObjectDoesNotExist
# from .models import Usuario  
# from rest_framework.authtoken.models import Token

# def google_callback(request):
#     email = request.GET.get('email')  # 📌 Usamos GET en lugar de request.data
#     if not email:
#         return JsonResponse({'error': 'Email requerido'}, status=400)

#     try:
#         user = Usuario.objects.get(correo=email)
#     except ObjectDoesNotExist:
#         user = Usuario.objects.create(correo=email, nombre=email.split('@')[0])  # Ajusta los campos según tu modelo
    
#     # Determinar si el usuario es administrador
#     is_admin = email == 'funkoimportcdelu@gmail.com'

#     user.rol = is_admin
#     user.save()
    
#     # Genera o obtiene el token del usuario
#     token, created = Token.objects.get_or_create(user=user)
    
#     return JsonResponse({'token': token.key, 'is_admin': is_admin})

from django.http import JsonResponse
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests

# 📌 CLIENT_ID de tu aplicación en Google Cloud
GOOGLE_CLIENT_ID = "CLIENT ID"

def google_login(request):
    token = request.GET.get("token")  # 📌 Recibe el token de Google
    if not token:
        return JsonResponse({"error": "Token no proporcionado"}, status=400)

    try:
        # 📌 Validar el token con Google
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            return JsonResponse({"error": "Emisor no válido"}, status=403)

        # 📌 Extraer información del usuario
        user_data = {
            "email": idinfo["email"],
            "name": idinfo.get("name", ""),
            "picture": idinfo.get("picture", ""),
            "is_admin": idinfo["email"] == "funkoimportcdelu@gmail.com"  # 📌 Verificar si es admin
        }

        return JsonResponse({"message": "Autenticación exitosa", "user": user_data})

    except ValueError:
        return JsonResponse({"error": "Token inválido"}, status=403)
