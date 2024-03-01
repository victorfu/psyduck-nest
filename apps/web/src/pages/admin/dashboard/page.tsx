import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User2Icon, LandPlotIcon } from "lucide-react";
import { useLoaderData } from "react-router-dom";
import CheckAdmin from "../check-admin";

function DashboardPage() {
  const { users, workspaces } = useLoaderData() as {
    users: User[];
    workspaces: Workspace[];
  };

  return (
    <CheckAdmin>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between px-4 py-8">
          <div className="prose lg:prose-xl">
            <h2 className="tracking-tight">Dashboard</h2>
          </div>
          <div className="flex flex-col items-center space-y-2 space-x-2 md:flex-row md:space-y-0">
            <DateRangePicker />
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="mt-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Users</CardTitle>
                  <User2Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{users.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Workspaces
                  </CardTitle>
                  <LandPlotIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workspaces.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CheckAdmin>
  );
}

export default DashboardPage;
