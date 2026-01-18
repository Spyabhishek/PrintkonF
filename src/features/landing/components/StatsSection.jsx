import { useStats } from '../../../shared/hooks/useStats';

const StatsSection = () => {
    const { data: stats = [], isLoading, isError } = useStats();

    if (isLoading) {
        return (
            <section className="py-12 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="text-center">
                                <div className="h-10 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto mb-2"></div>
                                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mx-auto"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (isError || !stats.length) {
        return null;
    }

    return (
        <section className="py-12 bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.id} className="text-center">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;