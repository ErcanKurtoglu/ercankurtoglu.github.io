---
title: "Derin Dil Modellerinde Çok Adımlı Mantıksal Çıkarım ve Muhakeme Sınırları"
abstract: "Bu çalışma, büyük dil modellerinin (LLMs) karmaşık mantıksal bulmacalar, sembolik kurallar ve nedensellik zincirleri karşısındaki başarısını ampirik olarak değerlendirmekte; model ölçekleme yasalarının tek başına mantıksal çıkarım garantisi veremediğini ortaya koymaktadır."
status: "Working Paper"
year: 2026
venue: "Preprint / In Review"
tags: ["Neuro-symbolic AI", "Formal Logic", "Reasoning", "LLMs"]
bibtex: |
  @article{ercan2026reasoning,
    title={Limits of Multi-Step Logical Reasoning in Transformer Architectures},
    author={Ercan},
    journal={arXiv preprint arXiv:2604.XXXXX},
    year={2026}
  }
---

## Araştırma Özeti ve Temel Bulgular

Dil modelleri dilbilgisi, metin üretimi ve anlamsal çağrışımlarda olağanüstü performans sergilese de, sembolik mantık ve formal doğrulama gerektiren çok adımlı çıkarımlarda hata payı katlanarak artmaktadır.

### İncelenen Temel Sorular

1. Model parametre sayısı arttıkça mantıksal çıkarım derinliği lineer olarak artıyor mu?
2. Chain-of-Thought (CoT) ve Scratchpad yöntemleri gerçek bir nedensellik mi sunuyor yoksa istatistiksel bir illüzyon mu?
3. Hibrit nöro-sembolik sistemler (LLM + SAT/SMT Solver) bu darboğazı nasıl aşabilir?

### Devam Eden Deneyler

Şu anda farklı model aileleri (açık ağırlıklı ve kapalı API tabanlı) üzerinde 500+ çok adımlı mantıksal problem kümesi çalıştırılmakta ve hata dağılımları sınıflandırılmaktadır.
