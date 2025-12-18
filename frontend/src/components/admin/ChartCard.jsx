import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

const ChartCard = ({ data }) => (
  <div className="bg-white p-6 rounded-xl shadow-md">
    <h3 className="text-lg font-semibold mb-4">System Overview</h3>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartCard;
