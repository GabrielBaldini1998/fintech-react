import TabelaInicio from '../../componentes/TabelaInicio';
import Titulo from '../../componentes/Navbar';
import SummaryCard from '../../componentes/SumaryCard';
import ProgressBar from '../../componentes/ProgressBar';


const summaryCards = [
    {
        "id": 1,
        "title": "Saldo Total",
        "value": 12500.00,
        "icon": "bi bi-cash-coin",
        "iconColor": "primary",
        "subtitle": "5% este mês",
        "trend": "up"
    },
    {
        "id": 2,
        "title": "Investido",
        "value": 4200.00,
        "icon": "bi bi-graph-up-arrow",
        "iconColor": "success",
        "subtitle": "Renda Fixa e FIIs",
        "trend": "up"
    },
    {
        "id": 3,
        "title": "Despesas",
        "value": 1850.00,
        "icon": "bi bi-credit-card",
        "iconColor": "danger",
        "subtitle": "Fatura fecha em 5 dias",
        "trend": "down"
    }
]

const gastosPorCategoria = [
    {
        "id": 1,
        "label": "Alimentação",
        "value": 535.00,
        "percentage": 35,
        "variant": "danger"
    },
    {
        "id": 2,
        "label": "Assinaturas",
        "value": 54.80,
        "percentage": 18,
        "variant": "warning"
    },
    {
        "id": 3,
        "label": "Transporte",
        "value": 28.50,
        "percentage": 12,
        "variant": "info"
    },
    {
        "id": 4,
        "label": "Outros",
        "value": 231.10,
        "percentage": 35,
        "variant": "secondary"
    }
]


const metasFinanceiras = [
    {
        "id": 1,
        "label": "Reserva de Emergência",
        "value": 8000.00,
        "percentage": 53,
        "variant": "success"
    },
    {
        "id": 2,
        "label": "Viagem para Europa",
        "value": 2500.00,
        "percentage": 25,
        "variant": "primary"
    },
    {
        "id": 3,
        "label": "Apartamento",
        "value": 42500.00,
        "percentage": 14,
        "variant": "warning"
    },
    {
        "id": 4,
        "label": "Carro Novo",
        "value": 15000.00,
        "percentage": 30,
        "variant": "info"
    }
]


const Inicio = () => {
    return (
        <>
            <Titulo titulo="Dashboard" />
            <div className="px-5 py-4">
                <div className="row g-3 mb-4">
                    {summaryCards.map((card) => (
                        <div key={card.id} className="col-md-4">
                            <SummaryCard
                                title={card.title}
                                value={card.value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}
                                icon={card.icon}
                                iconColor={card.iconColor}
                                subtitle={card.subtitle}
                                trend={card.trend}
                                trendType={card.trend === 'up' ? 'success' : 'danger'}
                            />
                        </div>
                    ))}
                </div>

                <TabelaInicio />

                <div className="row g-4 mt-2">
                    <div className="col-md-6">
                        <div className="bg-white py-4 px-4 rounded-lg shadow-sm">
                            <h5 className="mb-4 fw-bold">Gastos por Categoria</h5>
                            {gastosPorCategoria.map((card) => (
                                <ProgressBar
                                    key={card.id}
                                    label={card.label}
                                    value={card.value.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                    percentage={card.percentage}
                                    variant={card.variant}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="bg-white py-4 px-4 rounded-lg shadow-sm">
                            <h5 className="mb-4 fw-bold">Metas Financeiras</h5>
                            {metasFinanceiras.map((card) => (
                                <ProgressBar
                                    key={card.id}
                                    label={card.label}
                                    value={card.value.toLocaleString('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    })}
                                    percentage={card.percentage}
                                    variant={card.variant}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Inicio;