from django.http import JsonResponse
from django.shortcuts import render, redirect
from .models import Usuario, Coleccion, carrito, Descuento, Producto, Promocion, IngresoStock, ResenaComentario, Pregunta, CarritoDescuento, Factura, LineaFactura, ProductoCarrito, Edicion
# from django.views.generic import CreateView, TemplateView
from .serializers import UsuarioSerializer, ColeccionSerializer, CarritoSerializer, DescuentoSerializer, ProductoSerializer, PromocionSerializer, IngresoStockSerializer, ResenaComentarioSerializer, PreguntaSerializer, FacturaSerializer, LineaFacturaSerializer, EdicionSerializer
# from django.urls import reverse_lazy
from rest_framework import viewsets
import mercadopago
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.conf import settings
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from datetime import datetime
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.utils import timezone

# Create your views here.

#CRUDS
class UsuarioView(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer
    queryset = Usuario.objects.all()

class ColeccionView(viewsets.ModelViewSet): 
    serializer_class = ColeccionSerializer
    queryset = Coleccion.objects.all()

class EdicionView(viewsets.ModelViewSet):
    serializer_class = EdicionSerializer
    queryset = Edicion.objects.all()

class CarritoView(viewsets.ModelViewSet): 
    serializer_class = CarritoSerializer
    queryset = carrito.objects.all()

class DescuentoView(viewsets.ModelViewSet): 
    serializer_class = DescuentoSerializer
    queryset = Descuento.objects.all()

class ProductoView(viewsets.ModelViewSet): 
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = ProductoSerializer
    queryset = Producto.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PromocionView(viewsets.ModelViewSet):
    serializer_class = PromocionSerializer
    queryset = Promocion.objects.all().select_related('id_producto')
class resenaComentarioView(viewsets.ModelViewSet): 
    serializer_class = ResenaComentarioSerializer
    queryset = ResenaComentario.objects.all()

class preguntaView(viewsets.ModelViewSet):
    serializer_class = PreguntaSerializer
    queryset = Pregunta.objects.all()

class facturaView(viewsets.ModelViewSet):
    serializer_class = FacturaSerializer
    queryset = Factura.objects.all()

class lineaFacturaView(viewsets.ModelViewSet):
    serializer_class = LineaFacturaSerializer
    queryset = LineaFactura.objects.all()

class IngresoStockView(viewsets.ModelViewSet):
    serializer_class = IngresoStockSerializer
    queryset = IngresoStock.objects.all()

#GET ALL

def getUsuarios(request):
    usuarios = Usuario.objects.all()
    serializer = UsuarioSerializer(usuarios, many=True)
    return JsonResponse(serializer.data, safe=False)

def getColecciones(request):
    colecciones = Coleccion.objects.all()
    serializer = ColeccionSerializer(colecciones, many=True)
    return JsonResponse(serializer.data, safe=False)

def getEdiciones(request):
    ediciones = Edicion.objects.all()
    serializer = EdicionSerializer(ediciones, many=True)
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

def getFactura(request):
    facturas = Factura.objects.all()
    serializer = FacturaSerializer(facturas, many=True)
    return JsonResponse(serializer.data, safe=False)

def getLineaFactura(request):
    lineafacturas = LineaFactura.objects.all()
    serializer = LineaFacturaSerializer(lineafacturas, many=True)
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

def edicionRest (request):
    edicion=getEdiciones()
    return JsonResponse(edicion)

def FacturaRest (request):
    factura=getFactura()
    return JsonResponse(factura)

def LineaFacturaRest (request):
    lineafactura=getFactura()
    return JsonResponse(lineafactura)

#MercadoPago
ACCESS_TOKEN = settings.ACCESS_TOKEN

@csrf_exempt
def process_payment(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        sdk = mercadopago.SDK(settings.ACCESS_TOKEN)
        body = json.loads(request.body)

        # Datos de pago
        payment_data = {
            "transaction_amount": float(body.get("transaction_amount", 0)),
            "token": body.get("token"),
            "description": body.get("description", "Compra en FunkoStore"),
            "installments": int(body.get("installments", 1)),
            "payment_method_id": body.get("payment_method_id"),
            "payer": {"email": body.get("payer", {}).get("email")},
        }

        # Enviar pago a MercadoPago
        payment_response = sdk.payment().create(payment_data)
        payment = payment_response.get("response", {})

        if not payment or "status" not in payment:
            return JsonResponse({"error": "Error al procesar el pago"}, status=500)

        print("Estado del pago:", payment["status"])  # Depuración

        if payment["status"] == "approved":
            print("Pago aprobado, generando factura...")  # Depuración

            user_email = body["payer"]["email"]
            usuario = get_object_or_404(Usuario, correo=user_email)
            carrito_usuario = get_object_or_404(carrito, idUsuario=usuario)

            # Crear factura
            factura = Factura.objects.create(
                pago_total=payment["transaction_amount"],
                forma_pago="Mercado Pago",
                fecha_venta=timezone.now().date(),
                id_Usuario=usuario
            )
            print("Factura creada:", factura.id_factura)  # Depuración

            # Crear líneas de factura
            productos_carrito = ProductoCarrito.objects.filter(id_carrito=carrito_usuario)
            for producto_carrito in productos_carrito:
                LineaFactura.objects.create(
                    cantidad=producto_carrito.cantidad,
                    precioUnitario=producto_carrito.id_producto.precio,
                    idProducto=producto_carrito.id_producto,
                    id_factura=factura
                )

            print("Líneas de factura creadas")  # Depuración

            #Vaciar carrito después de la compra
            productos_carrito.delete()
            print("Carrito vaciado")  # Depuración

            return JsonResponse({"status": "success", "message": "Pago aprobado y factura generada"})
        
        else:
            return JsonResponse({"status": payment["status"], "message": "El pago no fue aprobado"}, status=400)

    except Exception as e:
        print("Error en process_payment:", str(e))
        return JsonResponse({"error": str(e)}, status=500)

from django.db import transaction

@csrf_exempt
def generar_factura(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
        user_email = data.get('userEmail')
        items = data.get('items')

        if not user_email or not items:
            return JsonResponse({"error": "Faltan datos requeridos"}, status=400)

        # Obtener el usuario
        usuario = Usuario.objects.get(correo=user_email)

        # Verificar que todos los productos existen antes de crear la factura
        productos_ids = [item['idProducto'] for item in items]
        productos = {p.idProducto: p for p in Producto.objects.filter(idProducto__in=productos_ids)}

        if len(productos) != len(productos_ids):
            return JsonResponse({"error": "Uno o más productos no existen"}, status=404)

        # Iniciar transacción
        with transaction.atomic():
            # Crear la factura sin definir `pago_total`, se calculará en `save()`
            factura = Factura.objects.create(id_Usuario=usuario)

            # Crear las líneas de factura
            for item in items:
                producto = productos[item['idProducto']]
                LineaFactura.objects.create(
                    cantidad=item['cantidad'],
                    precioUnitario=item['precio'],
                    idProducto=producto,
                    id_factura=factura
                )

            # Guardar la factura para actualizar el total
            factura.save()

            # Vaciar el carrito del usuario
            try:
                carrito_usuario = carrito.objects.get(idUsuario=usuario)
                ProductoCarrito.objects.filter(id_carrito=carrito_usuario).delete()
                carrito_usuario.total = 0
                carrito_usuario.save()
            except carrito.DoesNotExist:
                pass  # Si el usuario no tiene carrito, simplemente continuar

        return JsonResponse({"message": "Factura generada correctamente", "factura_id": factura.id_factura})

    except Usuario.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


from django.core.mail import send_mail
from django.template.loader import render_to_string

def enviar_factura_por_correo(usuario, factura):
    # Crear el mensaje de la factura en texto plano
    mensaje = f"""
    Hola {usuario.nombre},

    Gracias por tu compra en FunkoPopCdelU. Aquí están los detalles de tu factura:

    Factura N°: {factura.id_factura}
    Fecha: {factura.fecha_venta}
    Total: ${factura.pago_total}

    Productos:
    """

    # Agregar cada producto al mensaje
    for linea in factura.lineas_factura.all():
        mensaje += f" - {linea.idProducto.nombre}: {linea.cantidad} x ${linea.precioUnitario}\n"

    mensaje += "\n¡Gracias por tu compra!\nFunkoPopCdelU"

    # Enviar el correo electrónico
    send_mail(
        subject=f"Factura N° {factura.id_factura} - FunkoPopCdelU",
        message=mensaje,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[usuario.correo],
        fail_silently=False
    )


#Login Google
GOOGLE_CLIENT_ID = "668894091180-c9dah2k5g4j3nbi4pneic550md1a2iok.apps.googleusercontent.com"
@csrf_exempt
def google_login(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
        token = data.get("token")

        if not token:
            return JsonResponse({"error": "Token no proporcionado"}, status=400)

        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), GOOGLE_CLIENT_ID)

        if idinfo["iss"] not in ["accounts.google.com", "https://accounts.google.com"]:
            return JsonResponse({"error": "Emisor no válido"}, status=403)

        email = idinfo["email"]
        nombre = idinfo.get("given_name", "")
        apellido = idinfo.get("family_name", "")

        usuario, created = Usuario.objects.get_or_create(
            correo=email,
            defaults={
                "nombre": nombre,
                "apellido": apellido,
                "direccion": "",
                "telefono": "",
                "rol": False
            }
        )

        es_admin = email == "funkoimportcdelu@gmail.com"
        if es_admin and not usuario.rol:
            usuario.rol = True
            usuario.save()

        user_data = {
            "email": usuario.correo,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "rol": usuario.rol,
            "first_time": created,  # Indica si es un nuevo usuario
        }

        return JsonResponse({"message": "Autenticación exitosa", "user": user_data})

    except ValueError:
        return JsonResponse({"error": "Token inválido"}, status=403)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)

@csrf_exempt
def completar_perfil(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("correo")
        nombre = data.get("nombre")
        apellido = data.get("apellido")
        direccion = data.get("direccion")
        telefono = data.get("telefono")

        if not all([email, nombre, apellido, direccion, telefono]):
            return JsonResponse({"error": "Faltan datos obligatorios"}, status=400)

        usuario = Usuario.objects.filter(correo=email).first()

        if not usuario:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)

        usuario.nombre = nombre
        usuario.apellido = apellido
        usuario.direccion = direccion
        usuario.telefono = telefono
        usuario.save()

        return JsonResponse({"message": "Perfil actualizado correctamente", "user": {
            "email": usuario.correo,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "direccion": usuario.direccion,
            "telefono": usuario.telefono
        }})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)

@csrf_exempt
def user_data(request):
    if request.method != "GET":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    email = request.GET.get("email")
    if not email:
        return JsonResponse({"error": "Correo no proporcionado"}, status=400)

    usuario = Usuario.objects.filter(correo=email).first()
    if not usuario:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)

    user_data = {
        "nombre": usuario.nombre,
        "apellido": usuario.apellido,
        "correo": usuario.correo,
        "telefono": usuario.telefono,
        "direccion": usuario.direccion,
    }

    return JsonResponse({"user": user_data})

@csrf_exempt
def update_profile(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
        print("Datos recibidos en update_profile:", data)
        email = data.get("correo")
        nombre = data.get("nombre")
        apellido = data.get("apellido")
        telefono = data.get("telefono")
        direccion = data.get("direccion")

        usuario = Usuario.objects.filter(correo=email).first()
        if not usuario:
            return JsonResponse({"error": "Usuario no encontrado"}, status=404)

        if nombre:
            usuario.nombre = nombre
        if apellido:
            usuario.apellido = apellido
        if telefono:
            usuario.telefono = telefono
        if direccion:
            usuario.direccion = direccion

        usuario.save()

        return JsonResponse({"message": "Perfil actualizado correctamente"})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Formato JSON inválido"}, status=400)

def admin_dashboard_data(request):
    ventas_totales = Factura.objects.aggregate(total_ventas=Sum('pago_total'))['total_ventas'] or 0
    productos_activos = Producto.objects.count()
    clientes_activos = Usuario.objects.count()

    # Obtener el producto más vendido
    producto_mas_vendido = LineaFactura.objects.values('idProducto__nombre') \
        .annotate(total_vendido=Sum('cantidad')) \
        .order_by('-total_vendido') \
        .first()

    return JsonResponse({
        'ventas_totales': ventas_totales,
        'productos_activos': productos_activos,
        'clientes_activos': clientes_activos,
        'producto_mas_vendido': producto_mas_vendido['idProducto__nombre'] if producto_mas_vendido else 'N/A'
    })

def obtener_productos(request):
    #obtiene la lista de productos de la base de datos
    productos = Producto.objects.all().values(
        "idProducto", 
        "nombre", 
        "numero", 
        "idEdicion", 
        "esEspecial", 
        "descripcion", 
        "brilla", 
        "precio", 
        "cantidadDisp", 
        "imagen", 
        "idColeccion", 
        "precio_original"
    )
    
    productos_list = []
    for producto in productos:
        if producto["imagen"]:
            producto["imagen"] = request.build_absolute_uri(settings.MEDIA_URL + producto["imagen"])
        productos_list.append(producto)

    return JsonResponse(productos_list, safe=False)

@api_view(['GET'])
def obtener_detalle_producto(request, idProducto):
    try:
        # Usamos get_object_or_404 para obtener el producto por su idProducto
        producto = get_object_or_404(Producto, idProducto=idProducto)
        
        # Si el producto tiene imagen, lo mostramos como URL completa
        imagen_url = producto.imagen.url if producto.imagen else None
        
        # Enviar los datos del producto como una respuesta JSON
        return JsonResponse({
            "idProducto": producto.idProducto,
            "nombre": producto.nombre,
            "descripcion": producto.descripcion,
            "precio": str(producto.precio),  # Convertimos el precio a string para asegurar el formato correcto
            "imagen": imagen_url,
            "cantidadDisp": producto.cantidadDisp,
            "esEspecial": producto.esEspecial,
        })
    except Exception as e:
        # Si ocurre un error, lo devolvemos en formato JSON
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            correo = data.get("correo")
            id_producto = data.get("idProducto")
            cantidad = data.get("cantidad")

            if not id_producto or not cantidad or not correo:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Verificar si el usuario existe a partir del correo
            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

            # Verificar si el producto existe
            try:
                producto = Producto.objects.get(idProducto=id_producto)
            except Producto.DoesNotExist:
                return JsonResponse({"success": False, "message": "Producto no encontrado"}, status=404)

            # Obtener o crear el carrito del usuario
            carrito_usuario, created = carrito.objects.get_or_create(idUsuario=usuario)

            # Si no existe el carrito, se crea un carrito vacío
            if not created:
                # Si el carrito existe, verifica si el producto está en el carrito
                producto_carrito = ProductoCarrito.objects.filter(id_carrito=carrito_usuario, id_producto=producto).first()
                if not producto_carrito:
                    ProductoCarrito.objects.create(id_carrito=carrito_usuario, id_producto=producto, cantidad=cantidad)
            else:
                # Si el carrito fue creado, agregar el producto por primera vez
                ProductoCarrito.objects.create(id_carrito=carrito_usuario, id_producto=producto, cantidad=cantidad)

            # Actualizar el total del carrito
            carrito_usuario.actualizar_total()

            return JsonResponse({"success": True, "message": "Producto añadido al carrito"})

        except Exception as e:
            print(f"Error al agregar al carrito: {str(e)}")  # Imprimir más detalles sobre el error
            return JsonResponse({"success": False, "message": "Hubo un problema al agregar al carrito", "error": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)

@api_view(['GET'])
def obtener_carrito(request):
    userEmail = request.headers.get('userEmail')  # Obtener el correo desde los headers
    if not userEmail:
        return JsonResponse({"error": "Usuario no autenticado"}, status=401)

    try:
        # Obtener usuario por correo
        usuario = Usuario.objects.get(correo=userEmail)
        
        # Obtener el carrito del usuario (si existe)
        carrito_usuario = carrito.objects.filter(idUsuario=usuario).first()
        if not carrito_usuario:
            return JsonResponse({"error": "Carrito no encontrado"}, status=404)

        # Obtener los productos del carrito
        productos_carrito = ProductoCarrito.objects.filter(id_carrito=carrito_usuario)

        productos = [{
            "idProducto": item.id_producto.idProducto,
            "nombre": item.id_producto.nombre,
            "cantidad": item.cantidad,
            "precio": float(item.id_producto.precio),
            "imagen": item.id_producto.imagen.url,
        } for item in productos_carrito]

        return JsonResponse({
            "idCarrito": carrito_usuario.idCarrito,
            "total": float(carrito_usuario.total),
            "productos": productos,
        })

    except Usuario.DoesNotExist:
        return JsonResponse({"error": "Usuario no encontrado"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def actualizar_cantidad(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_token = data.get("user_token")
            id_producto = data.get("idProducto")
            nueva_cantidad = data.get("cantidad")

            if not user_token or not id_producto or not nueva_cantidad:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Obtener usuario por token
            try:
                usuario = Usuario.objects.get(token=user_token)
            except Usuario.DoesNotExist:
                return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

            # Obtener producto
            try:
                producto = Producto.objects.get(idProducto=id_producto)
            except Producto.DoesNotExist:
                return JsonResponse({"success": False, "message": "Producto no encontrado"}, status=404)

            # Obtener carrito del usuario
            carrito_usuario = carrito.objects.get(idUsuario=usuario)

            # Verificar si el producto está en el carrito
            producto_carrito = ProductoCarrito.objects.filter(carrito=carrito_usuario, producto=producto).first()
            if not producto_carrito:
                return JsonResponse({"success": False, "message": "Producto no está en el carrito"}, status=404)

            # Actualizar la cantidad
            producto_carrito.cantidad = nueva_cantidad
            producto_carrito.save()

            # Actualizar el total del carrito
            carrito_usuario.actualizar_total()

            return JsonResponse({"success": True, "message": "Cantidad actualizada en el carrito"})

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
 
@csrf_exempt
def aplicar_descuento(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            codigo_descuento = data.get("codigoDescuento")
            user_email = data.get("userEmail")

            if not codigo_descuento or not user_email:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Buscar el usuario por su email
            usuario = Usuario.objects.get(correo=user_email)
            # Buscar el carrito asociado a ese usuario
            carrito_usuario = carrito.objects.get(idUsuario=usuario)

            # Buscar el descuento por su código
            try:
                descuento = Descuento.objects.get(codigoDescuento=codigo_descuento)
            except Descuento.DoesNotExist:
                return JsonResponse({"success": False, "message": "Código de descuento no válido"}, status=404)

            # Verificar si el descuento ya fue aplicado al carrito
            if CarritoDescuento.objects.filter(idCarrito=carrito_usuario, idDescuento=descuento).exists():
                return JsonResponse({"success": False, "message": "El descuento ya fue aplicado a este carrito"}, status=400)

            # Verificar si la fecha de validez del descuento es correcta
            if descuento.fechaInicio <= datetime.date.today() <= descuento.fechaFin:
                # Calcular el nuevo total con el descuento aplicado
                subtotal = carrito_usuario.calcular_total()
                nuevo_total = subtotal * (1 - descuento.porcentaje)
                carrito_usuario.total = nuevo_total
                carrito_usuario.save()

                # Registrar el descuento en la tabla CarritoDescuento
                CarritoDescuento.objects.create(idCarrito=carrito_usuario, idDescuento=descuento)

                return JsonResponse({
                    "success": True,
                    "message": "Descuento aplicado",
                    "descuento": str(descuento.porcentaje * 100),  # Mostrar el porcentaje como entero
                    "newTotal": str(nuevo_total),
                })
            else:
                return JsonResponse({"success": False, "message": "Código de descuento expirado"}, status=400)

        except Usuario.DoesNotExist:
            return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)
        except carrito.DoesNotExist:
            return JsonResponse({"success": False, "message": "Carrito no encontrado"}, status=404)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)


###########################################################################################################

@api_view(['DELETE'])
def eliminar_producto_carrito(request):
    user_email = request.GET.get('userEmail')
    id_producto = request.GET.get('idProducto')

    if not user_email or not id_producto:
        return Response({"error": "Faltan parámetros"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Buscar el usuario por su correo (no email)
        usuario = Usuario.objects.get(correo=user_email)
        # Buscar el carrito asociado a ese usuario
        carrito_usuario = carrito.objects.get(idUsuario=usuario)
    except Usuario.DoesNotExist:
        return Response({"error": "El usuario no existe"}, status=status.HTTP_404_NOT_FOUND)
    except carrito.DoesNotExist:
        return Response({"error": "El carrito no existe"}, status=status.HTTP_404_NOT_FOUND)

    try:
        producto = Producto.objects.get(idProducto=id_producto)
    except Producto.DoesNotExist:
        return Response({"error": "El producto no existe"}, status=status.HTTP_404_NOT_FOUND)

    # Buscar el producto en la tabla intermedia ProductoCarrito
    producto_en_carrito = ProductoCarrito.objects.filter(id_carrito=carrito_usuario, id_producto=producto).first()
    
    if producto_en_carrito:
        producto_en_carrito.delete()  # Eliminar el producto del carrito
        carrito_usuario.actualizar_total()  # Actualiza el total después de eliminar
        return Response({"message": "Producto eliminado del carrito"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Producto no encontrado en el carrito"}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
def create_payment_preference(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            total = data.get('total')
            items = data.get('items')
            user_email = data.get('payer', {}).get('email')

            if not total or not items or not user_email:
                return JsonResponse({"error": "Faltan datos requeridos"}, status=400)

            sdk = mercadopago.SDK(settings.ACCESS_TOKEN)

            preference_data = {
                "items": items,
                "payer": {
                    "email": user_email,
                },
                "back_urls": {
                    "success": "http://localhost:5173/user/success",
                    "failure": "http://localhost:5173/user/failure",
                    "pending": "http://localhost:5173/user/pending",
                },
                "auto_return": "approved",
            }

            preference_response = sdk.preference().create(preference_data)
            preference = preference_response["response"]

            return JsonResponse({"preferenceId": preference["id"], "init_point": preference["init_point"]})

        except json.JSONDecodeError:
            return JsonResponse({"error": "Formato JSON inválido"}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido, use POST"}, status=405)

#preguntas

@api_view(['GET'])
def obtener_preguntas_producto(request, idProducto):
    try:
        preguntas = Pregunta.objects.filter(id_producto=idProducto).select_related('id_Usuario')
        preguntas_data = []
        for pregunta in preguntas:
            preguntas_data.append({
                "id_pregunta": pregunta.id_pregunta,
                "pregunta": pregunta.pregunta,
                "respuesta": pregunta.respuesta,
                "id_Usuario": {
                    "nombre": pregunta.id_Usuario.nombre,
                    "correo": pregunta.id_Usuario.correo
                }
            })
        return JsonResponse(preguntas_data, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    

@csrf_exempt
def crear_pregunta(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            pregunta_texto = data.get("pregunta")
            id_producto = data.get("id_producto")
            correo = data.get("correo")

            if not pregunta_texto or not id_producto or not correo:
                return JsonResponse({"success": False, "message": "Datos incompletos"}, status=400)

            # Verificar si el usuario existe
            try:
                usuario = Usuario.objects.get(correo=correo)
            except Usuario.DoesNotExist:
                return JsonResponse({"success": False, "message": "Usuario no encontrado"}, status=404)

            # Verificar si el producto existe
            try:
                producto = Producto.objects.get(idProducto=id_producto)
            except Producto.DoesNotExist:
                return JsonResponse({"success": False, "message": "Producto no encontrado"}, status=404)

            # Crear la pregunta
            pregunta = Pregunta.objects.create(
                pregunta=pregunta_texto,
                id_producto=producto,
                id_Usuario=usuario
            )

            return JsonResponse({
                "success": True,
                "message": "Pregunta creada correctamente",
                "pregunta": {
                    "id_pregunta": pregunta.id_pregunta,
                    "pregunta": pregunta.pregunta,
                    "respuesta": pregunta.respuesta,
                    "id_Usuario": {
                        "nombre": usuario.nombre,
                        "correo": usuario.correo
                    }
                }
            })

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)

@csrf_exempt
def responder_pregunta(request, idPregunta):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            respuesta_texto = data.get("respuesta")

            if not respuesta_texto:
                return JsonResponse({"success": False, "message": "Respuesta no proporcionada"}, status=400)

            # Verificar si la pregunta existe
            try:
                pregunta = Pregunta.objects.get(id_pregunta=idPregunta)
            except Pregunta.DoesNotExist:
                return JsonResponse({"success": False, "message": "Pregunta no encontrada"}, status=404)

            # Actualizar la pregunta con la respuesta
            pregunta.respuesta = respuesta_texto
            pregunta.save()

            return JsonResponse({
                "success": True,
                "message": "Respuesta enviada correctamente",
                "pregunta": {
                    "id_pregunta": pregunta.id_pregunta,
                    "pregunta": pregunta.pregunta,
                    "respuesta": pregunta.respuesta,
                    "id_Usuario": {
                        "nombre": pregunta.id_Usuario.nombre,
                        "correo": pregunta.id_Usuario.correo
                    }
                }
            })

        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)

    return JsonResponse({"success": False, "message": "Método no permitido"}, status=405)
