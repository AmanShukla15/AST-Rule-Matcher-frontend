import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/RuleForm.css';
import { server } from '../constant/config';

const fields = ['age', 'department', 'salary', 'experience'];
const operators = ['>', '<', '>=', '<=', '='];
const conditions = ['AND', 'OR'];

function EvaluteForm() {
    const [combinedAST, setCombinedAST] = useState('');
    const [ruleParts, setRuleParts] = useState([]);
    const [selectedField, setSelectedField] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [data, setData] = useState({ age: '', department: '', salary: '', experience: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRules = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${server}`);
                setCombinedAST(response);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching rules:", error);
            }
        };

        fetchRules();
    }, [result])

    const addRulePart = () => {
        if (selectedField && selectedOperator && selectedValue) {
            const formattedValue = isNaN(selectedValue) ? `'${selectedValue}'` : selectedValue;
            const newPart = `${selectedField} ${selectedOperator} ${formattedValue}`;
            setRuleParts([...ruleParts, newPart]);
            clearSelections();
        }
        if (selectedCondition) {
            setRuleParts([...ruleParts, selectedCondition]);
            setSelectedCondition('');
        }
    };

    const clearSelections = () => {
        setSelectedField('');
        setSelectedOperator('');
        setSelectedValue('');
    };

    const deleteRulePart = (index) => {
        const updatedRule = ruleParts.filter((_, i) => i !== index);
        setRuleParts(updatedRule);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const rule = ruleParts.join(' ');
        try {
            if (validateInputs()) {
                const response = await axios.post(`${server}/evaluate-rule`, { rule, data });
                setResult(response.data.result);
            }
        } catch (error) {
            console.error("Error evaluating rule", error);
        }
    };

    const validateInputs = () => {
        if (ruleParts.length === 0) {
            alert('Rule cannot be empty');
            return false;
        }
        if (!/^\d+$/.test(data.age)) {
            alert('Age must be a number');
            return false;
        }
        if (!data.department.trim()) {
            alert('Department cannot be empty');
            return false;
        }
        if (!/^\d+$/.test(data.salary)) {
            alert('Salary must be a number');
            return false;
        }
        if (!/^\d+$/.test(data.experience)) {
            alert('Experience must be a number');
            return false;
        }
        return true;
    };

    return (
        <div className="rule-form-container">
            <h1>Assignmen 1 : Rule Calculator</h1>
            <div className="rule-builder-container">
                <h2>Create Rule</h2>
                <div className="rule-input-group">
                    <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="input">
                        <option value="">Select Field</option>
                        {fields.map((field) => (
                            <option key={field} value={field}>{field}</option>
                        ))}
                    </select>

                    <select value={selectedOperator} onChange={(e) => setSelectedOperator(e.target.value)} className="input">
                        <option value="">Select Operator</option>
                        {operators.map((operator) => (
                            <option key={operator} value={operator}>{operator}</option>
                        ))}
                    </select>

                    <input
                        type="text"
                        value={selectedValue}
                        onChange={(e) => setSelectedValue(e.target.value)}
                        placeholder="Value"
                        className="input"
                    />
                    <button onClick={addRulePart} className="button">Add to Rule</button>
                </div>

                <div className="rule-condition-group">
                    <select value={selectedCondition} onChange={(e) => setSelectedCondition(e.target.value)} className="input">
                        <option value="">Select Condition</option>
                        {conditions.map((condition) => (
                            <option key={condition} value={condition}>{condition}</option>
                        ))}
                    </select>

                    <button onClick={addRulePart} className="button">Add Condition</button>
                </div>

                <div className="rule-display">
                    <p>Current Rule:</p>
                    <ul>
                        {ruleParts.map((part, index) => (
                            <li key={index}>
                                {part} <button onClick={() => deleteRulePart(index)} className="delete-button">Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="form">
            <h2>Evaluate Rule</h2>
                <div className="form-group">
                    <label className="label">Age:</label>
                    <input
                        type="number"
                        placeholder='Enter age'
                        value={data.age}
                        onChange={(e) => setData({ ...data, age: e.target.value })}
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label className="label">Department:</label>
                    <input
                        type="text"
                        placeholder='(i.e Sales, Marketing)'
                        value={data.department}
                        onChange={(e) => setData({ ...data, department: e.target.value })}
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label className="label">Salary:</label>
                    <input
                        type="number"
                        placeholder='Enter amount'
                        value={data.salary}
                        onChange={(e) => setData({ ...data, salary: e.target.value })}
                        className="input"
                    />
                </div>
                <div className="form-group">
                    <label className="label">Experience:</label>
                    <input
                        type="number"
                        placeholder='Enter experience'
                        value={data.experience}
                        onChange={(e) => setData({ ...data, experience: e.target.value })}
                        className="input"
                    />
                </div>
                <button type="submit" className="button">Evaluate Rule</button>
            </form>

            {loading ? (<h4 className='loading'>Loading..</h4>)
                :
                (result !== null && <div className={`result ${result ? 'result-true' : 'result-false'}`}>Result: {result ? 'True' : 'False'}</div>)}
            <div
                style={{
                    marginTop: "20px"
                }}
            >
            <h2>Combine Previous Rules</h2>
                {combinedAST && combinedAST.data.map((item, index) => (
                    <div key={item._id || index} className="ruleContainer">
                        <pre className="ruleString">{JSON.stringify(item.ruleString, null, 2)}</pre>
                        <button onClick={()=> setRuleParts([...ruleParts, item.ruleString])} className='button'>
                            Add
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EvaluteForm;
