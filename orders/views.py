from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

from .models import Order, OrderItem, ShippingAddress
from .serializers import OrderSerializer
from products.models import Product


@api_view(['GET'])
@permission_classes([IsAdminUser])
def search(request):
    query = request.query_params.get('query')
    if query is None:
        query = ''
    order = Order.objects.filter(user__email__icontains=query)
    serializer = OrderSerializer(order, many=True)
    return Response({'orders': serializer.data})


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_orders(request):
    orders = Order.objects.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    user = request.user
    data = request.data
    orderItems = data['order_items']
    total_price = data['total_price']

    # Calcular la suma de los precios de los productos
    sum_of_prices = sum(int(float(item['price'])) * item['quantity'] for item in orderItems)

    # si el precio total es igual a la suma, creamos la orden
    if total_price == sum_of_prices:
        order = Order.objects.create(
            user=user,
            total_price=total_price
        )

        # creamos un ShoppingAddress
        ShippingAddress.objects.create(
            order=order,
            address=data['address'],
            city=data['city'],
            postal_code=data['postal_code'],
        )

        #Por cada producto creado en el OrderItem, creamos un OrderItem
        for i in orderItems:
            product = Product.objects.get(id=i['id'])
            item = OrderItem.objects.create(
                product=product,
                order=order,
                quantity=i['quantity'],
                price=i['price']
            )
            #Le por cada item agregado le restamos la cantidad en sctock al producto
            product.count_in_stock -= item.quantity
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'message': sum_of_prices}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def solo_order(request, pk):
    user = request.user
    try:
        order = Order.objects.get(pk=pk)
        #Solo el usuario admin o el usuario dueño de la orden pueden ver los datos de la orden
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            Response({'detail': 'No access to view orders'},
                    status=status.HTTP_401_UNAUTHORIZED)
    except:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_orders(request):
    user = request.user
    orders = user.order_set.all()
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

#Verificar si al orden esta entregada
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def delivered(request, pk):
    order = Order.objects.get(pk=pk)
    order.is_delivered = True
    order.delivered_at = datetime.now()
    order.save()
    return Response('Order was delivered')
