# def align_images(image,template,maxFeatures,keepPercent,debug)
    - são aceitos cinco parametros:
        - image: foto de entrada que vai ser lida e digitalizada 
        - template : foto que serve como modelo 
        - maxFeatures : coloca um limite superior no número de regiões de pontos-chave candidatas a serem consideradas
        - keepPercent : designa a porcentagem de correspondências de pontos-chave a serem mantidas, permitindo-nos efetivamente eliminar resultados de correspondência de pontos-chave ruidosos
        -debug : indica se os pontos-chave devem ser exibidos, por padrão não são exibidos. 


## imageGray
## templateGray 
    - converte a imagem em tons de cinza

  
#   orb = cv2.ORB_create(maxFeatures)
    - inicia o detector ORB 
    - detecta os pontos-chave e extrai os binarios locais 
    - Para maiores informações sobre o ORB consulte: https://docs.opencv.org/3.4/d1/d89/tutorial_py_orb.html

# method = cv2.DESCRIPTOR_MATCHER_BRUTEFORCE_HAMMING 
# matcher = cv2.DescriptorMatcher_create(method)
# matches = matcher.match(descsA, descsB, None)

    - cv2.DESCRIPTOR_MATCHER_BRUTEFORCE_HAMMING: calcula a distancia entre os recursos binários para encontrar as melhores correspondencias 
    - para maiores informações consulte : https://docs.opencv.org/3.4/db/d39/classcv_1_1DescriptorMatcher.html#aea3d791a454b74e7a215b926e98cef24a7362dae849e477ed4b1bc862c8ebb5c4

# classificação, filtragem e exibição 

# matches = sorted(matches, key=lambda x: x.distance)
    - classifica as correspondencias pela distancia 
# keep = int(len(matches)*keepPercent)
    - manter apenas as melhores correspondencias

# if debug:
    - verifica se devemos visualizar os pontos-chave correspondentes
## ptsA ptsB
    - aloca memoria para armazenar os pontos-chave

# for (i, m) in enumerate(matches):
    - looop sobre os matches indicando os pontos-chave A e B 

# (H, mask) = cv2.findHomography(ptsA, ptsB, method=cv2.RANSAC)
    - calcula a matriz de homografia entre dois conjuntos de pontos
    - a matriz é encontrada usando os pontos-chave e o algoritimo RANSAC
    - para saber mais sobre o algoritmo RANSAC consulte: https://opencv.org/evaluating-opencvs-new-ransacs/

# (h, w) = template.shape[:2]
    - usa a matriz de homografia para alinhar as imagens 
