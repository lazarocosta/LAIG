/**
 * Pyramid
 * @constructor
 */
function Pyramid(scene) {
    CGFobject.call(this, scene);

    this.frente = new Triangle(this.scene, -0.5, 0, 0.5, 0.5, 0, 0.5, 0, 1, 0);//esquerda, direita top
    this.esquerda= new Triangle(this.scene, 0, 1, 0, -0.5, 0, -0.5, -0.5, 0, 0.5);//top esquerda direita
    this.tras = new Triangle(this.scene, -0.5, 0, -0.5, 0, 1, 0,  0.5, 0, -0.5);//esquerda, top, direita
    this.direita = new Triangle(this.scene, 0.5, 0, -0.5, 0, 1, 0, 0.5, 0, 0.5);//direita top esquerda
    this.fundo = new Rectangle(this.scene, -0.5, -0.5, 0.5, 0.5);
};

Pyramid.prototype = Object.create(CGFobject.prototype);
Pyramid.prototype.constructor = Pyramid;

Pyramid.prototype.display = function () {
    
    this.scene.pushMatrix();
    this.esquerda.display();
    this.tras.display();
    this.direita.display();
    this.frente.display();
    this.scene.rotate(Math.PI/2, 1, 0, 0);   
    this.fundo.display();
    this.scene.popMatrix();
};