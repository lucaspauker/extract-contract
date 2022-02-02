import time
import os
from flask import Flask, jsonify, request

import torch
from torch.utils.data import DataLoader, SequentialSampler
from transformers import (
    AutoConfig,
    AutoModelForQuestionAnswering,
    AutoTokenizer
)

from transformers.data.processors.squad import SquadResult, SquadV2Processor, SquadExample
from transformers.data.metrics.squad_metrics import compute_predictions_logits
from transformers.data.processors.squad import squad_convert_examples_to_features

app = Flask(__name__)

questions = ['Highlight the parts (if any) of this contract related to "Document Name" \
that should be reviewed by a lawyer. Details: The name of the contract']
model_path = os.path.join(os.getcwd(), 'models/roberta-base')

def to_list(tensor):
    return tensor.detach().cpu().tolist()

# Return a list of questions based on the first datapoint/contract in the test set, we could simplify this
# in the future.

# Extract questions for a single contract
def run_prediction(question_texts, context_text, model_path):
    
    ### Setting hyperparameters, need to understand what some of these are doing
    
    max_seq_length = 512 
    doc_stride = 256 # Determines length of sliding window / how many tokens should be fed into model at one time
    n_best_size = 1 
    max_query_length = 64
    max_answer_length = 512
    do_lower_case = False
    null_score_diff_threshold = 0.0

    # model_name_or_path = "../cuad-models/roberta-base/"


    config_class, model_class, tokenizer_class = (
        AutoConfig, AutoModelForQuestionAnswering, AutoTokenizer)

    config = config_class.from_pretrained(model_path)

    tokenizer = tokenizer_class.from_pretrained(
        model_path, do_lower_case=True, use_fast=False)

    model = model_class.from_pretrained(model_path, config=config)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    processor = SquadV2Processor()
    examples = []

    # Create an example for each question
    for i, question_text in enumerate(question_texts):
        example = SquadExample(
            qas_id=str(i),
            question_text=question_text,
            context_text=context_text,
            answer_text=None,
            start_position_character=None,
            title="Predict",
            answers=None,)
        examples.append(example)
    
    
    features, dataset = squad_convert_examples_to_features(
        examples=examples,
        tokenizer=tokenizer,
        max_seq_length=max_seq_length,
        doc_stride=doc_stride,
        max_query_length=max_query_length,
        is_training=False,
        return_dataset="pt",
        threads=1,
    )

    eval_sampler = SequentialSampler(dataset)
    eval_dataloader = DataLoader(dataset, sampler=eval_sampler, batch_size=10)
    
    all_results = []

    for batch in eval_dataloader:
        model.eval()
        batch = tuple(t.to(device) for t in batch)
        
        with torch.no_grad():
            inputs = {
                "input_ids": batch[0],
                "attention_mask": batch[1],
                "token_type_ids": batch[2],
            }

            example_indices = batch[3]

            outputs = model(**inputs)

            for i, example_index in enumerate(example_indices):
                eval_feature = features[example_index.item()]
                unique_id = int(eval_feature.unique_id)

                output = [to_list(output[i]) for output in outputs.to_tuple()]

                start_logits, end_logits = output
                result = SquadResult(unique_id, start_logits, end_logits)
                all_results.append(result)

    final_predictions = compute_predictions_logits(
        all_examples=examples,
        all_features=features,
        all_results=all_results,
        n_best_size=n_best_size,
        max_answer_length=max_answer_length,
        do_lower_case=do_lower_case,
        output_prediction_file=None,
        output_nbest_file=None,
        output_null_log_odds_file=None,
        verbose_logging=False,
        version_2_with_negative=True,
        null_score_diff_threshold=null_score_diff_threshold,
        tokenizer=tokenizer
    )
    
    return final_predictions


@app.route("/dummy_predict", methods=["POST"])
def dummy_predict():
    if request.method == "POST":
        contract_text = request.get_json()["input"]
        preds = run_prediction(questions, contract_text, model_path)
        return jsonify({questions[0]: list(preds.items())[0][1]})

if __name__ == '__main__':
    app.run()