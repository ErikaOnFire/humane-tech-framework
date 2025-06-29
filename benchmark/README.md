# Human Friendliness Evaluation

An evaluation framework for testing AI assistant personas on human-friendly behavior using the AISI Inspect framework. The evaluation compares a "good" human-friendly persona against a "bad" engagement-maximizing persona across various scenarios.

## Prerequisites

- Python 3

## Setup

### 1. Create and activate a virtual environment

```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install requirements

```bash
pip install -r requirements.txt
```

### 3. Install VSCode extensions (optional)

Install the following VSCode extensions:
- [Inspect AI](https://marketplace.visualstudio.com/items?itemName=ukaisi.inspect-ai) - For running and debugging Inspect evaluations
- [Data Wrangler](https://marketplace.visualstudio.com/items?itemName=ms-toolsai.datawrangler) - For viewing and editing the dataset

## Running the Evaluation

To run both the good and bad persona evaluations:

```bash
rm -rf logs/* && inspect eval-set src/good_persona_task.py src/bad_persona_task.py --model openai/gpt-4o
```

### Model Options

You can specify different models using the format from the [Inspect AI providers documentation](https://inspect.aisi.org.uk/providers.html). Examples:

- `openai/gpt-4o`
- `anthropic/claude-3-5-sonnet-20241022`
- `google/gemini-2.5-pro`

## Dataset

The evaluation uses `data/simple_human_friendliness_dataset.csv`, which contains test scenarios across various categories of Humane Technology, such as:

- Loneliness & Social Connection
- Screen Time & Dependency
- Mental Health & Crisis
- Transparency & AI Understanding
- Privacy & Data Rights
- Ethical Alignment

### Updating the Dataset

To modify the evaluation scenarios, edit `data/simple_human_friendliness_dataset.csv`. The dataset includes:

- `input`: The user's question or scenario
- `target`: The expected human-friendly response
- `category`: The type of scenario being tested
- `severity`: The importance level (low, medium, high, critical)
- `principle_to_evaluate`: The core principle being assessed

Of these fields, `input` and `target` are required. The others serve as metadata that hopefully helps the scorer evaluate adherance to the target.

## Project Structure

```
├── src/
│   ├── good_persona_task.py    # Human-friendly persona evaluation
│   ├── bad_persona_task.py     # Engagement-maximizing persona evaluation
├── data/
│   └── simple_human_friendliness_dataset.csv  # Test scenarios
├── logs/                      # Evaluation results
```

## Results

Evaluation results are saved in the `logs/` directory with detailed scoring and analysis of how each persona performs across different human-friendliness principles. Inspect requires this directory to be empty before running again, so if you wish to save a run for comparison, you should copy it somewhere else first.

### Here is an video of Humane Tech member Jack Senechal running this inspect framework against OpenAI's GPT 4o vs. Claude Sonnet 3.5:

[![Inspect LLM Demo](https://p144.p3.n0.cdn.zight.com/items/6qupqLxX/293550a6-cea8-4cc4-bb0a-f7f6f530c577.png)](https://drodio.wistia.com/medias/njfoa1856w)

