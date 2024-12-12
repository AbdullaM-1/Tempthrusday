import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentPageProps {
  onComplete: (data: PaymentData) => void
  totalAmount: number
}

interface PaymentData {
  method: string
  details: any
}

const countries = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "EU", name: "European Union", currency: "EUR" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "JP", name: "Japan", currency: "JPY" },
]

export function PaymentPage({ onComplete, totalAmount }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState<string>("")
  const [country, setCountry] = useState<string>("")
  const [confirmationCode, setConfirmationCode] = useState<string>("")
  const [transactionId, setTransactionId] = useState<string>("")
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
  })

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value)
    setCountry("")
    setConfirmationCode("")
    setTransactionId("")
    setCardDetails({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      name: "",
    })
  }

  const handleCardDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value,
    })
  }

  const handleComplete = () => {
    let details = {}
    switch (paymentMethod) {
      case "card":
        details = { ...cardDetails }
        break
      case "paypal":
        // In a real application, you would initiate the PayPal payment here
        details = { message: "PayPal payment initiated" }
        break
      case "bank":
        details = { country, transactionId }
        break
      case "zelle":
        details = { confirmationCode }
        break
    }
    onComplete({ method: paymentMethod, details })
  }

  const handlePayPalClick = () => {
    // In a real application, you would initiate the PayPal payment flow here
    console.log("Initiating PayPal payment flow")
    // For this example, we'll just call handleComplete
    handleComplete()
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Payment</h2>

      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup onValueChange={handlePaymentMethodChange} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card">Credit/Debit Card</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank" id="bank" />
              <Label htmlFor="bank">Bank Transfer</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="zelle" id="zelle" />
              <Label htmlFor="zelle">Zelle</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {paymentMethod === "card" && (
        <Card>
          <CardHeader>
            <CardTitle>Credit/Debit Card Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={cardDetails.cardNumber}
                onChange={handleCardDetailsChange}
                placeholder="1234 5678 9012 3456"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={cardDetails.expiryDate}
                  onChange={handleCardDetailsChange}
                  placeholder="MM/YY"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  value={cardDetails.cvv}
                  onChange={handleCardDetailsChange}
                  placeholder="123"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                name="name"
                value={cardDetails.name}
                onChange={handleCardDetailsChange}
                placeholder="John Doe"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "paypal" && (
        <Card>
          <CardHeader>
            <CardTitle>PayPal Payment</CardTitle>
            <CardDescription>Click the button below to proceed with PayPal payment</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handlePayPalClick} className="w-full">
              Pay with PayPal
            </Button>
          </CardContent>
        </Card>
      )}

      {paymentMethod === "bank" && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="country">Select Country</Label>
              <Select onValueChange={setCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {country && (
              <div className="space-y-2">
                <p>Please transfer {totalAmount} {countries.find(c => c.code === country)?.currency} to the following account:</p>
                <p>Bank: Example Bank</p>
                <p>Account Number: 1234567890</p>
                <p>SWIFT/BIC: EXAMPLEBANK</p>
                <div>
                  <Label htmlFor="transactionId">Transaction ID</Label>
                  <Input
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Enter your transaction ID"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {paymentMethod === "zelle" && (
        <Card>
          <CardHeader>
            <CardTitle>Zelle Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Please send {totalAmount} USD to the following Zelle email address:</p>
            <p className="font-bold">contactabullahmehdi@gmail.com</p>
            <div>
              <Label htmlFor="confirmationCode">Confirmation Code</Label>
              <Input
                id="confirmationCode"
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                placeholder="Enter the confirmation code"
              />
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleComplete}
          size="lg"
          disabled={
            !paymentMethod ||
            (paymentMethod === "card" && Object.values(cardDetails).some(value => !value)) ||
            (paymentMethod === "bank" && (!country || !transactionId)) ||
            (paymentMethod === "zelle" && !confirmationCode)
          }
        >
          Complete Payment
        </Button>
      </div>
    </div>
  )
}

