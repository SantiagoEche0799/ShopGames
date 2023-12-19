
from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('search/', views.search),
    path('', views.get_products),
    path('get/<slug:slug>/', views.get_product),
    path('get_admin/<int:id>/', views.get_product_admin),
    path('post/', views.create_product),
    path('edit/<int:pk>/', views.edit_product),
    path('delete/<int:pk>/', views.delete_product),
    path('cate/<str:category>/', views.get_prod_by_category),
    path('review/<int:pk>/', views.create_review),

]
