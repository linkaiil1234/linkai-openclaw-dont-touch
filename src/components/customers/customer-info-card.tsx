"use client";

type Customer = {
  id: string;
  name: string;
  email: string;
  status: string;
  spending: number;
  channels: string[];
  phone?: string;
  location?: string;
};

type CustomerInfoCardProps = {
  customer: Customer;
};

export default function CustomerInfoCard({ customer }: CustomerInfoCardProps) {
  return (
    <div className="p-5 border rounded-2xl lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-foreground mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-muted-foreground">
                Full Name
              </p>
              <p className="text-sm font-medium text-foreground">
                {customer.name}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-muted-foreground">
                Email address
              </p>
              <p className="text-sm font-medium text-foreground">
                {customer.email}
              </p>
            </div>

            {customer.phone && (
              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Phone
                </p>
                <p className="text-sm font-medium text-foreground">
                  {customer.phone}
                </p>
              </div>
            )}

            {customer.location && (
              <div>
                <p className="mb-2 text-xs leading-normal text-muted-foreground">
                  Location
                </p>
                <p className="text-sm font-medium text-foreground">
                  {customer.location}
                </p>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs leading-normal text-muted-foreground">
                Status
              </p>
              <p className="text-sm font-medium text-foreground">
                {customer.status}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-muted-foreground">
                Total Spending
              </p>
              <p className="text-sm font-medium text-foreground">
                ${customer.spending.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
