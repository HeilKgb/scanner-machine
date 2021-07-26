# def cleanUp_text(): 
    - remove o texto não ASCII de uma string. 

# ap = argparse.ArgumentParser()
    - o argparse é um modulo que facilita a criação de interfaces de linha de comando amigáveis ao usuário. 
    - também gera automaticamente mensagens de ajuda e uso e emite erros quando os usuários fornecem argumentos inválidos ao programa

    -ARGUMENTPARSER: 
        - . Todos os parâmetros devem ser passados ​​como argumentos de palavra-chave. Cada parâmetro tem sua própria descrição.
    - para maiores detalhes do funcionamneto entre em : https://docs.python.org/3/library/argparse.html#argparse.ArgumentParser

# ap.add_argument('-i', '--image', required=True, help="path to input image that we'll align to template")
    - --image: entrada de uma imagem
    - --template: o caminho para a imagem modelo
    -  python3 ocr_cnh.py --image scans/chn.jpg --template scans/cnh_padrao.jpg

# OCRLOCATION 
    - name: OCRLocation é o nome da tupla
    - id: breve descrição do campo para fácil referência
    - bbox: as coordenadas da caixa delimitadora de um campo em forma de lista usando a ordem; [x,y,w,h]
    X e y são as coordenadas do canto superior esquerdo
    w e h são a largura e a altura 
    - filter_keywords: uma lista de palavas que não desejamos considerar para o OCR

# image = cv2.imread(args['image'])
# template = cv2.imread(args['template'])
 - carregam a imagem e o template 

# aligned = align_Images.align_images(image, template,debug=True)
    - tratar alinhamento e distorções da perspectiva
    - quando em produção tirar o debug, pois pode acabar aparecendo erros para o usuario

# parsingResults 
    - lista os resultados do OCR para cada campo do texto  

# for i in OCR_LOCATIONS 
    -extraimos o ROI di=o campo de texto da imagem alinhada
    - o tesseract espera uma imagem RGB

# Quebra do OCR
    
# for line in text.split("\n")
    - loop sobre o text, onde as linhas vazias são ignoradas
    - if: assumindo que line não está vazio, filtramos por palavra chave  

## lower = line count = sum([lower.count(x) for x in loc.filter_keywords])
    - realizam o processo de filtragem e adicionam o campo ao parsingResults 
    -o código acima filtra automaticamente o texto de instrução dentro do campo , garantindo que apenas o texto inserido por humanos seja retornado.

# results={} 
    - é um dicionario que conterá os resultados de analise limpos constituidos no ID exclusivo da localização do texto
    - o for serve para preencher o results

# for (loc, line) in parsingResults:
    - pegamos qualquer reultado existente para o ID
    - se não houver resultado, armazenamos o text em line e loc no results 
    - caso exista, acrescentamos o line para qualquer existingText separados por uma nova linha e atualizamos o results

# for (locID, result) in results.items():
    - descompactar a tupla do OCR 
    - descompactar text e loc 
    - os reultados são impressos no terminal 
    
# (x, y, w, h) = loc["bbox"]
    - extrair as coordenadas da caixa delimitadora do campo de texto 

# clean = cleanup_text(text)
    - texto limpo, com apenas os caracteres do ASCII

# cv2.rectangle(aligned, (x, y), (x + w, y + h), (0, 255, 0), 2) 
     - cria um retangulo verde ao redor das coordenadas

   
##  for (i, line) in enumerate(text.split("\n")):
    - adiciona texto na imagem 

# cv2.imshow('Input',imutils.resize(image, with= 550))
# cv2.imshow('Output',imutils.resize(aligbed, with= 550))
    - exibe a imagem original e o resultado das transformações 
    
