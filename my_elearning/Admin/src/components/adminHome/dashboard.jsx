import DashSidebar from "./DashSidebar";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { AgChartsReact } from 'ag-charts-react';

const Dashboard = () => {

  const [totalVideos, setTotalVideos] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [options, setOptions] = useState({
    
    title: {
        text: 'Portfolio Composition',
    },
    series: [
        {
            type: 'pie',
            angleKey: 'value',
            legendItemKey: 'label',
        },
    ],
});

useEffect(() =>{
    updateChartOptions();
})

  useEffect(() => {
    // Fetch total videos
    axios.get("http://localhost:8000/api/totalVideos")
      .then(response =>{ 
        setTotalVideos(response.data.totalVideos);
        updateChartOptions();
    })
      .catch(error => console.error("Error fetching total videos:", error));

    // Fetch total users
    axios.get("http://localhost:8000/api/totalUsers")
      .then(response => {
        setTotalUsers(response.data.totalUsers);
        updateChartOptions();
    })
      .catch(error => console.error("Error fetching total users:", error));
  }, []);

  const updateChartOptions = () => {
    setOptions({
      ...options,
      data: [
        { label: 'Total Videos', value: totalVideos },
        { label: 'Total Users', value: totalUsers },
      ],
    });
  };
    return (
        <>
            <DashSidebar />
            <div className="p-4 sm:ml-64">
                <div className="grid grid-cols-2 gap-4 border-2 border-current p-10 m-10 borders" style={{ borderColor: '#FFA500', boxShadow: '1px 3px 10px #d97a07' }}>
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-white  md:text-5xl lg:text-6xl">
                        {totalVideos}
                        </h1>
                        <p className="text-lg mt-1 text-white">Total Videos</p>
                    </div>
                    
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl">
                            {totalUsers}
                        </h1>
                        <p className="text-lg mt-1 text-white">Total Users</p>
                    </div>
                    

                </div>
                <div className="chart-container" style={{ width: '80%', height: '400px', marginLeft: '8rem' }}>
                    <AgChartsReact options={options} />
                </div>
            </div>
        </>
    );
};
 
export default Dashboard;