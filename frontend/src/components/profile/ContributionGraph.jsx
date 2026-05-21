import React, { useMemo } from 'react';

const ContributionGraph = ({ commits }) => {
    // Generate dates for the last year
    const { dates, commitMap, maxCount } = useMemo(() => {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setFullYear(endDate.getFullYear() - 1);
        // adjust to start on a Sunday to keep layout clean
        startDate.setDate(startDate.getDate() - startDate.getDay());

        const datesArray = [];
        let currDate = new Date(startDate);
        while (currDate <= endDate) {
            datesArray.push(new Date(currDate));
            currDate.setDate(currDate.getDate() + 1);
        }

        // Map commits by date string YYYY-MM-DD
        const map = {};
        let max = 0;
        commits?.forEach(commit => {
            if (!commit.createdAt) return;
            const dateStr = new Date(commit.createdAt).toISOString().split('T')[0];
            map[dateStr] = (map[dateStr] || 0) + 1;
            if (map[dateStr] > max) max = map[dateStr];
        });

        return { dates: datesArray, commitMap: map, maxCount: max || 1 };
    }, [commits]);

    // Group dates by weeks (columns)
    const weeks = useMemo(() => {
        const w = [];
        let currentWeek = [];
        dates.forEach(d => {
            currentWeek.push(d);
            if (currentWeek.length === 7) {
                w.push(currentWeek);
                currentWeek = [];
            }
        });
        if (currentWeek.length > 0) w.push(currentWeek);
        return w;
    }, [dates]);

    // Color intensity based on commit count
    const getColorClass = (count) => {
        if (count === 0) return 'bg-[#161b22] border border-gray-800'; // empty
        // using relative scaling
        const ratio = count / maxCount;
        if (ratio < 0.25) return 'bg-green-900 border border-green-800';
        if (ratio < 0.5) return 'bg-green-700 border border-green-600';
        if (ratio < 0.75) return 'bg-green-500 border border-green-500';
        return 'bg-green-400 border border-green-400';
    };

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return (
        <div className="bg-[#0d1117] p-6 rounded-2xl border border-gray-800 overflow-x-auto custom-scrollbar">
            <h3 className="text-xl font-bold mb-4 text-gray-200">
                {commits?.length || 0} contributions in the last year
            </h3>
            
            <div className="flex flex-col min-w-max">
                {/* Months Row */}
                <div className="flex ml-8 mb-2 text-xs text-gray-500">
                    {weeks.map((week, i) => {
                        if (week[0].getDate() <= 7 && i % 4 === 0) {
                            return <div key={i} className="flex-1 min-w-[12px]">{months[week[0].getMonth()]}</div>;
                        }
                        return <div key={i} className="flex-1 min-w-[12px]"></div>;
                    })}
                </div>

                <div className="flex gap-1">
                    {/* Days Row */}
                    <div className="flex flex-col gap-1 text-[10px] text-gray-500 mr-2 pt-1">
                        <span className="h-[12px]">Sun</span>
                        <span className="h-[12px]"></span>
                        <span className="h-[12px]">Tue</span>
                        <span className="h-[12px]"></span>
                        <span className="h-[12px]">Thu</span>
                        <span className="h-[12px]"></span>
                        <span className="h-[12px]">Sat</span>
                    </div>

                    {/* Graph Grid */}
                    {weeks.map((week, wIndex) => (
                        <div key={wIndex} className="flex flex-col gap-1">
                            {week.map((date, dIndex) => {
                                const dateStr = date.toISOString().split('T')[0];
                                const count = commitMap[dateStr] || 0;
                                return (
                                    <div
                                        key={dIndex}
                                        title={`${count} commits on ${dateStr}`}
                                        className={`w-[12px] h-[12px] rounded-[2px] transition hover:ring-1 hover:ring-white ${getColorClass(count)}`}
                                    ></div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 justify-end">
                    <span>Less</span>
                    <div className="w-[12px] h-[12px] rounded-[2px] bg-[#161b22] border border-gray-800"></div>
                    <div className="w-[12px] h-[12px] rounded-[2px] bg-green-900 border border-green-800"></div>
                    <div className="w-[12px] h-[12px] rounded-[2px] bg-green-700 border border-green-600"></div>
                    <div className="w-[12px] h-[12px] rounded-[2px] bg-green-500 border border-green-500"></div>
                    <div className="w-[12px] h-[12px] rounded-[2px] bg-green-400 border border-green-400"></div>
                    <span>More</span>
                </div>
            </div>
        </div>
    );
};

export default ContributionGraph;
