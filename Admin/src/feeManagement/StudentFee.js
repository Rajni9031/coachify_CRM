import React, { useState } from 'react';

const FeeManagementCalculator = () => {
    const [totalFees, setTotalFees] = useState(90000);
    const [registrationFee, setRegistrationFee] = useState(5000);
    const [discount, setDiscount] = useState(0);
    const [batchStartDate, setBatchStartDate] = useState('');
    const [finalAmount, setFinalAmount] = useState('');
    const [installmentType, setInstallmentType] = useState('default');
    const [numInstallments, setNumInstallments] = useState(3);
    const [installments, setInstallments] = useState([]);

    const styles = {
        container: {
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: '80%',
            justifyContent: 'center',
            height: '80%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'auto',
        },
        formSection: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            width: '100%',
        },
        formGroup: {
            flex: 1,
            margin: '0 10px',
        },
        label: {
            fontWeight: 'bold',
            color: '#555',
            marginBottom: '5px',
            display: 'block',
        },
        input: {
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '16px',
            boxSizing: 'border-box',
        },
        button: {
            width: '100%',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            marginTop: '20px',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        installmentDetails: {
            display: installmentType === 'custom' ? 'block' : 'none',
            marginTop: '20px',
            width: '100%',
        },
        installmentRow: {
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '10px',
        },
        installmentRowInput: {
            width: '48%',
        },
        result: {
            backgroundColor: '#f8f9fa',
            padding: '15px',
            borderRadius: '5px',
            overflowY: 'auto',
            maxHeight: '300px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            width: '100%',
        },
        installment: {
            backgroundColor: '#e9ecef',
            padding: '10px',
            borderRadius: '5px',
            textAlign: 'left',
            margin: '10px',
            flex: '0 0 30%',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
    };

    const handleCalculate = () => {
        const amountAfterRegistration = totalFees - registrationFee;
        const discountAmount = (amountAfterRegistration * discount) / 100;
        const final = amountAfterRegistration - discountAmount;
        setFinalAmount(final.toFixed(2));

        const dueDate = new Date(batchStartDate);
        const newInstallments = [];

        if (installmentType === 'default') {
            const amounts = [
                (final * 0.4).toFixed(2),
                (final * 0.3).toFixed(2),
                (final * 0.3).toFixed(2),
            ];
            const dates = [3, 6, 9].map(months => {
                const date = new Date(dueDate);
                date.setMonth(date.getMonth() + months);
                return date.toDateString();
            });

            amounts.forEach((amount, index) => {
                newInstallments.push({
                    amount,
                    dueDate: dates[index],
                });
            });
        } else {
            let totalPercent = 0;

            for (let i = 0; i < numInstallments; i++) {
                const percent = parseFloat(document.getElementById(`percent${i}`).value);
                const months = parseInt(document.getElementById(`months${i}`).value);
                totalPercent += percent;

                if (isNaN(percent) || isNaN(months)) {
                    alert('Please fill out all fields for installments.');
                    return;
                }

                dueDate.setMonth(dueDate.getMonth() + months);
                newInstallments.push({
                    amount: ((final * percent) / 100).toFixed(2),
                    dueDate: dueDate.toDateString(),
                });
            }

            if (totalPercent !== 100) {
                alert('Total percentage must equal 100.');
                return;
            }
        }

        setInstallments(newInstallments);
        document.getElementById('installments').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={styles.container}>
            <form onSubmit={e => e.preventDefault()}>
                <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px', marginTop: '0' }}>
                    Fee Management Calculator
                </h1>
                <div style={styles.formSection}>
                    <div style={styles.formGroup}>
                        <label htmlFor="totalFees" style={styles.label}>Total Fees:</label>
                        <input
                            type="number"
                            id="totalFees"
                            value={totalFees}
                            min="0"
                            onChange={e => setTotalFees(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="registrationFee" style={styles.label}>Registration Fee:</label>
                        <input
                            type="number"
                            id="registrationFee"
                            value={registrationFee}
                            min="0"
                            onChange={e => setRegistrationFee(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="discount" style={styles.label}>Scholarship Discount (%):</label>
                        <input
                            type="number"
                            id="discount"
                            value={discount}
                            min="0"
                            max="100"
                            onChange={e => setDiscount(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                </div>

                <div style={styles.formSection}>
                    <div style={styles.formGroup}>
                        <label htmlFor="batchStartDate" style={styles.label}>Batch Start Date:</label>
                        <input
                            type="date"
                            id="batchStartDate"
                            value={batchStartDate}
                            onChange={e => setBatchStartDate(e.target.value)}
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="finalAmount" style={styles.label}>Final Amount After Discount:</label>
                        <input
                            type="text"
                            id="finalAmount"
                            value={finalAmount}
                            readOnly
                            style={styles.input}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label htmlFor="installmentType" style={styles.label}>Installment Type:</label>
                        <select
                            id="installmentType"
                            value={installmentType}
                            onChange={e => setInstallmentType(e.target.value)}
                            style={styles.input}
                        >
                            <option value="default">Default (3 Installments)</option>
                            <option value="custom">Custom (3 to 5 Installments)</option>
                        </select>
                    </div>
                </div>

                <div style={styles.installmentDetails}>
                    <label htmlFor="numInstallments" style={styles.label}>Number of Installments (3 to 5):</label>
                    <input
                        type="number"
                        id="numInstallments"
                        min="3"
                        max="5"
                        value={numInstallments}
                        onChange={e => setNumInstallments(e.target.value)}
                        style={styles.input}
                    />
                    <div id="installmentInputs">
                        {[...Array(numInstallments)].map((_, i) => (
                            <div key={i} style={styles.installmentRow}>
                                <input
                                    type="number"
                                    placeholder={`Percent for Installment ${i + 1}`}
                                    min="0"
                                    max="100"
                                    id={`percent${i}`}
                                    style={styles.installmentRowInput}
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Months after previous"
                                    min="0"
                                    id={`months${i}`}
                                    style={styles.installmentRowInput}
                                    required
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div id="installments" style={styles.result}>
                    {installments.map((installment, index) => (
                        <div key={index} style={styles.installment}>
                            <p>
                                <strong>Installment {index + 1}:</strong> {installment.amount}<br />
                                <strong>Due Date:</strong> {installment.dueDate}
                            </p>
                        </div>
                    ))}
                </div>

                <button type="button" onClick={handleCalculate} style={styles.button}>
                    Calculate
                </button>
            </form>
        </div>
    );
};

export default FeeManagementCalculator;