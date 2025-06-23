import React from 'react';
import { TrendingUp, DollarSign, Package, Calendar, Store as StoreIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const SalesTracking = () => {
  const { user } = useAuth();

  if ("sales" in user) {
    const storeSales = user.sales || [];
    const totalSales = storeSales.reduce((sum, sale) => sum + sale.total, 0);
    const salesThisMonth = storeSales.filter(sale => {
      const saleDate = new Date(sale.date);
      const now = new Date();
      return saleDate.getMonth() === now.getMonth() && saleDate.getFullYear() === now.getFullYear();
    });
    const monthlySales = salesThisMonth.reduce((sum, sale) => sum + sale.total, 0);

    const getStatusText = (status: string) => {
      switch (status) {
        case 'pending':
          return 'Pendente';
        case 'processing':
          return 'Processando';
        case 'delivered':
          return 'Entregue';
        case 'cancelled':
          return 'Cancelado';
        default:
          return status;
      }
    };

    return (
        <div className="max-w-6xl mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total de Vendas</p>
                    <p className="text-2xl font-bold">R$ {totalSales.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Vendas do Mês</p>
                    <p className="text-2xl font-bold">R$ {monthlySales.toFixed(2)}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pedidos Totais</p>
                    <p className="text-2xl font-bold">{storeSales.length}</p>
                  </div>
                  <Package className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Histórico de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {storeSales.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhuma venda registrada ainda.</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                    {storeSales.map((sale) => (
                        <Card key={sale.id} className="border">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-semibold">Venda #{sale.orderId}</h3>
                                <p className="text-sm text-gray-600">
                                  {new Date(sale.date).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-green-600">
                                  R$ {sale.total.toFixed(2)}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {getStatusText(sale.status)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    ))}
                  </div>
              )}
            </CardContent>
          </Card>
        </div>
    );
  } else {
    return (
        <div className="text-center py-8">
          <StoreIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            Você precisa estar logado como uma loja para ver o histórico de vendas.
          </p>
        </div>
    );
  }


};

export default SalesTracking;