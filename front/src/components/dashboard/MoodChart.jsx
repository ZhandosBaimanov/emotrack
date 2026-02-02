import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useMemo } from 'react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) {
		const data = payload[0].payload
		return (
			<div className='glass-card p-4 shadow-lg rounded-xl'>
				<p className='text-sm font-medium text-white/60'>{label}</p>
				<div className='flex items-center gap-2 mt-1'>
					<span className='text-2xl font-bold text-white'>
						{data.intensity}
					</span>
					<span className='text-xl'>
						{data.intensity >= 8 ? '😊' : data.intensity >= 5 ? '😐' : '😔'}
					</span>
				</div>
				{data.note && (
					<p className='text-xs text-white/40 mt-2 max-w-[200px] truncate'>
						{data.note}
					</p>
				)}
			</div>
		)
	}
	return null
}

const MoodChart = ({ data = [] }) => {
	// Sort data by date
	const sortedData = useMemo(() => {
		return [...data]
			.sort(
				(a, b) =>
					new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
			)
			.map(entry => ({
				...entry,
				formattedDate: format(parseISO(entry.created_at), 'd MMM', {
					locale: ru,
				}),
			}))
	}, [data])

	return (
		<div className='glass-card p-6'>
			<div className='flex justify-between items-center mb-6'>
				<h3 className='text-lg font-semibold text-white'>
					Динамика настроения
				</h3>
			</div>

			<ResponsiveContainer width='100%' height={280}>
				<AreaChart
					data={sortedData}
					margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
				>
					<defs>
						<linearGradient id='colorScore' x1='0' y1='0' x2='0' y2='1'>
							<stop offset='5%' stopColor='#8b5cf6' stopOpacity={0.4} />
							<stop offset='95%' stopColor='#8b5cf6' stopOpacity={0} />
						</linearGradient>
					</defs>
					<CartesianGrid
						strokeDasharray='3 3'
						vertical={false}
						stroke='rgba(255, 255, 255, 0.1)'
					/>
					<XAxis
						dataKey='formattedDate'
						axisLine={false}
						tickLine={false}
						tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}
						dy={10}
					/>
					<YAxis
						domain={[0, 10]}
						axisLine={false}
						tickLine={false}
						tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 12 }}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{ stroke: '#8b5cf6', strokeWidth: 2 }}
					/>
					<ReferenceLine
						y={5}
						stroke='rgba(255, 255, 255, 0.1)'
						strokeDasharray='3 3'
					/>
					<Area
						type='monotone'
						dataKey='intensity'
						stroke='#8b5cf6'
						strokeWidth={3}
						fillOpacity={1}
						fill='url(#colorScore)'
						activeDot={{ r: 6, strokeWidth: 0, fill: '#7C3AED' }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}

export default MoodChart
