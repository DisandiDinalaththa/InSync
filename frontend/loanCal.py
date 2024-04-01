def calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years, loan_term_months):
    # Convert annual interest rate to monthly interest rate
    monthly_interest_rate = annual_interest_rate / 12 / 100
    
    # Convert loan term to total number of months
    total_months = loan_term_years * 12 + loan_term_months
    
    # Calculate monthly payment using the formula
    monthly_payment = (loan_amount * monthly_interest_rate * (1 + monthly_interest_rate) ** total_months) / \
                      (((1 + monthly_interest_rate) ** total_months) - 1)
    
    return monthly_payment

def main():
    # Get input from the user
    loan_amount = float(input("Enter the loan amount: "))
    annual_interest_rate = float(input("Enter the annual interest rate (in percentage): "))
    loan_term_years = int(input("Enter the loan term in years: "))
    loan_term_months = int(input("Enter the loan term in months: "))
    
    # Calculate monthly payment
    monthly_payment = calculate_loan_payment(loan_amount, annual_interest_rate, loan_term_years, loan_term_months)
    
    # Output the result
    print(f"Monthly payment: LKR {monthly_payment:.2f}")
    
    remaining_principal = loan_amount
    for month in range(1, loan_term_years * 12 + loan_term_months + 1):
        interest_payment = remaining_principal * (annual_interest_rate / 12 / 100)
        principal_payment = monthly_payment - interest_payment
        print(f"Month {month}: Capital Payment: LKR {principal_payment:.2f}, Interest Payment: LKR {interest_payment:.2f}")
        remaining_principal -= principal_payment

if __name__ == "__main__":
    main()


