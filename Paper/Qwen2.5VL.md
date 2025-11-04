---
type: paper
tags:
  - algorithm
  - VLM
  - LLM
  - code/python
  - DeepLearning
  - math
publish: arxiv preprint
pdf: "[[Paper/PDF/2502.13923v1.pdf]]"
rate: 🌟🌟🌟🌟
done: true
---
> [!note]- paper
> ![[2502.13923v1.pdf]]

[Huggingface Repo](https://huggingface.co/docs/transformers/main/en/model_doc/qwen2_5_vl)

pipeline:
![[2502.13923v1.pdf#page=3&rect=46,466,543,782|2502.13923v1, p.3]]

允许接入视频或者图片.

模型结构:
```
Qwen2_5_VLModel(
  (visual): Qwen2_5_VisionTransformerPretrainedModel(
    (patch_embed): Qwen2_5_VisionPatchEmbed(
      (proj): Conv3d(3, 1280, kernel_size=(2, 14, 14), stride=(2, 14, 14), bias=False)
    )
    (rotary_pos_emb): Qwen2_5_VisionRotaryEmbedding()
    (blocks): ModuleList(
      (0-31): 32 x Qwen2_5_VLVisionBlock(
        (norm1): Qwen2RMSNorm((1280,), eps=1e-06)
        (norm2): Qwen2RMSNorm((1280,), eps=1e-06)
        (attn): Qwen2_5_VLVisionAttention(
          (qkv): Linear(in_features=1280, out_features=3840, bias=True)
          (proj): Linear(in_features=1280, out_features=1280, bias=True)
        )
        (mlp): Qwen2_5_VLMLP(
          (gate_proj): Linear(in_features=1280, out_features=3420, bias=True)
          (up_proj): Linear(in_features=1280, out_features=3420, bias=True)
          (down_proj): Linear(in_features=3420, out_features=1280, bias=True)
          (act_fn): SiLU()
        )
      )
    )
    (merger): Qwen2_5_VLPatchMerger(
      (ln_q): Qwen2RMSNorm((1280,), eps=1e-06)
      (mlp): Sequential(
        (0): Linear(in_features=5120, out_features=5120, bias=True)
        (1): GELU(approximate='none')
        (2): Linear(in_features=5120, out_features=2048, bias=True)
      )
    )
  )
  (language_model): Qwen2_5_VLTextModel(
    (embed_tokens): Embedding(151936, 2048)
    (layers): ModuleList(
      (0-35): 36 x Qwen2_5_VLDecoderLayer(
        (self_attn): Qwen2_5_VLAttention(
          (q_proj): Linear(in_features=2048, out_features=2048, bias=True)
          (k_proj): Linear(in_features=2048, out_features=256, bias=True)
          (v_proj): Linear(in_features=2048, out_features=256, bias=True)
          (o_proj): Linear(in_features=2048, out_features=2048, bias=False)
          (rotary_emb): Qwen2_5_VLRotaryEmbedding()
        )
        (mlp): Qwen2MLP(
          (gate_proj): Linear(in_features=2048, out_features=11008, bias=False)
          (up_proj): Linear(in_features=2048, out_features=11008, bias=False)
          (down_proj): Linear(in_features=11008, out_features=2048, bias=False)
          (act_fn): SiLU()
        )
        (input_layernorm): Qwen2RMSNorm((2048,), eps=1e-06)
        (post_attention_layernorm): Qwen2RMSNorm((2048,), eps=1e-06)
      )
    )
    (norm): Qwen2RMSNorm((2048,), eps=1e-06)
    (rotary_emb): Qwen2_5_VLRotaryEmbedding()
  )
)
```

## Forward

模型以及函数基于[transformers](https://huggingface.co/docs/transformers/en/installation)库进行分析.
### Image Feature / Video Feature

使用`get_image_features()`获取图片信息:
```python
def get_image_features(self, pixel_values: torch.FloatTensor, image_grid_thw: Optional[torch.LongTensor] = None):
	"""
	Encodes images into continuous embeddings that can be forwarded to the language model.
	Args:
		pixel_values (`torch.FloatTensor` of shape `(batch_size, num_channels, image_size, image_size)`):
			The tensors corresponding to the input images.
		image_grid_thw (`torch.LongTensor` of shape `(num_images, 3)`, *optional*):
			The temporal, height and width of feature shape of each image in LLM.
	"""
	
	pixel_values = pixel_values.type(self.visual.dtype)
	image_embeds = self.visual(pixel_values, grid_thw=image_grid_thw)
	split_sizes = (image_grid_thw.prod(-1) // self.visual.spatial_merge_size**2).tolist()
	image_embeds = torch.split(image_embeds, split_sizes)
	return image_embeds
```

其中`vision`是之前架构中提到的VisionTransformer(ViT). `grid_thw`是图片的temporal(时间, 默认值为0/1?), height, width.

由于输入的pixel_values需要经过vision模块的`Qwen2_5_VisionPatchEmbed`, 因此pixel_values的shape应该为: `[BatchSize, 3, NumberOfImages, Height, Weight]`的格式(`grid_thw`的顺序, 此处`t`表示一共提供了多少images)

然后将`image_embs`和原始的text的embeddings拼接:
```python
inputs_embeds = self.get_input_embeddings()(input_ids)
if pixel_values is not None:
	image_embeds = self.get_image_features(pixel_values, image_grid_thw) # 刚刚获取到的image features
	image_embeds = torch.cat(image_embeds, dim=0)
	n_image_tokens = (input_ids == self.config.image_token_id).sum()
	n_image_features = image_embeds.shape[0]
	if not is_torchdynamo_compiling() and n_image_tokens != n_image_features:
		raise ValueError(
			f"Image features and image tokens do not match: tokens: {n_image_tokens}, features {n_image_features}"
		)

	mask = input_ids == self.config.image_token_id
	mask_unsqueezed = mask.unsqueeze(-1)
	mask_expanded = mask_unsqueezed.expand_as(inputs_embeds)
	image_mask = mask_expanded.to(inputs_embeds.device)

	image_embeds = image_embeds.to(inputs_embeds.device, inputs_embeds.dtype)
	inputs_embeds = inputs_embeds.masked_scatter(image_mask, image_embeds)
```

然后使用`get_rope_index`来获取`position_ids`:
```python
if position_ids is None:
	attention_mask_tensor = (
		attention_mask if not isinstance(attention_mask, dict) else attention_mask["full_attention"]
	)
	if attention_mask_tensor is not None and attention_mask_tensor.ndim == 4:
		attention_mask_tensor = torch.diagonal(attention_mask_tensor[:, 0], dim1=1, dim2=2)
		attention_mask_tensor = attention_mask_tensor / torch.finfo(attention_mask_tensor.dtype).min
		attention_mask_tensor = (1.0 - attention_mask_tensor).int()

	# Calculate RoPE index once per generation in the pre-fill stage only.
	# When compiling, we can't check tensor values thus we check only input length
	# It is safe to assume that `length!=1` means we're in pre-fill because compiled
	# models currently cannot do asssisted decoding
	prefill_compiled_stage = is_torchdynamo_compiling() and (
		(input_ids is not None and input_ids.shape[1] != 1)
		or (inputs_embeds is not None and inputs_embeds.shape[1] != 1)
	)
	prefill_noncompiled_stage = not is_torchdynamo_compiling() and (
		(cache_position is not None and cache_position[0] == 0)
		or (past_key_values is None or past_key_values.get_seq_length() == 0)
	)
	if (prefill_compiled_stage or prefill_noncompiled_stage) or self.rope_deltas is None:
		position_ids, rope_deltas = self.get_rope_index(
			input_ids,
			image_grid_thw,
			video_grid_thw,
			second_per_grid_ts=second_per_grid_ts,
			attention_mask=attention_mask_tensor,
		)
		self.rope_deltas = rope_deltas
	# then use the prev pre-calculated rope-deltas to get the correct position ids
	else:
		batch_size, seq_length, _ = inputs_embeds.shape
		delta = (
			(cache_position[0] + self.rope_deltas).to(inputs_embeds.device)
			if cache_position is not None
			else 0
		)
		position_ids = torch.arange(seq_length, device=inputs_embeds.device)
		position_ids = position_ids.view(1, -1).expand(batch_size, -1)
		if cache_position is not None:  # otherwise `deltas` is an int `0`
			delta = delta.repeat_interleave(batch_size // delta.shape[0], dim=0)
		position_ids = position_ids.add(delta)
		position_ids = position_ids.unsqueeze(0).expand(3, -1, -1)
```

