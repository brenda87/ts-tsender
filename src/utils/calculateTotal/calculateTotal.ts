function calculateTotal(amounts: string): number {
    // Split the amounts string by commas or newlines, trim whitespace, and filter out empty strings
    const amountArray = amounts
        .split(/[\n,]+/)
        .map(amt => amt.trim()) // remove whitespace 
        .filter(amt => amt !== '') // filter out empty strings
        .map(amt => parseFloat(amt)) // convert to numbers
    
    // sum all the valid numbers(ignoring NaN)
    return amountArray
        .filter(num => !isNaN(num)) // filter out NaN values
        .reduce((sum, num) => sum + num, 0); // sum the valid numbers

}