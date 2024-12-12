import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChannelSelector } from "@/components/channel-selector"
import { StatisticsCards } from "@/components/statistics-cards"
import { ActiveViewsChart } from "@/components/active-views-chart"
import { VideoProductionOrders } from "@/components/video-production-orders"

export default function Dashboard() {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div>
          <Link to="/OrderFlow">
          <Button className="mr-2">Create New Order</Button>
          </Link>
          <Link to="/messages">
            <Button variant="outline">Messages</Button>
          </Link>
        </div>
      </div>
      <ChannelSelector 
        selectedChannels={selectedChannels} 
        onChannelSelect={setSelectedChannels} 
      />
      <StatisticsCards selectedChannels={selectedChannels} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Views (Last 24 Hours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ActiveViewsChart selectedChannels={selectedChannels} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Video Production Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoProductionOrders selectedChannels={selectedChannels} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

