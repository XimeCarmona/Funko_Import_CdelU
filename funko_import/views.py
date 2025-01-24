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
ACCESS_TOKEN = "token"

@csrf_exempt
def create_preference(request):
    if request.method == "POST":
        try:
            # Inicializar el SDK de Mercado Pago
            sdk = mercadopago.SDK(ACCESS_TOKEN)
            
            # Obtener los datos del cuerpo de la solicitud
            body = json.loads(request.body)

            # Crear preferencia de pago
            preference_data = {
                "items": [
                    {
                        "title": body["title"],  # Título del producto
                        "quantity": int(body["quantity"]),  # Cantidad
                        "unit_price": float(body["price"])  # Precio unitario
                    }
                ],
                "back_urls": {
                    "success": "http://localhost:3000/success",
                    "failure": "http://localhost:3000/failure",
                    "pending": "http://localhost:3000/pending"
                },
                "auto_return": "approved"  # Retornar automáticamente al success si el pago es aprobado
            }

            # Crear la preferencia en Mercado Pago
            preference_response = sdk.preference().create(preference_data)
            preference = preference_response["response"]

            # Retornar la preferencia al cliente
            return JsonResponse({"id": preference["id"]})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    return JsonResponse({"error": "Invalid request method"}, status=400)
